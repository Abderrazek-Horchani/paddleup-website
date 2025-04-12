const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const winston = require('winston');

// Load environment variables
dotenv.config();

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging middleware
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/paddleup', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => logger.info('Connected to MongoDB'))
.catch(err => logger.error('MongoDB connection error:', err));

// Booking Schema
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  whatsapp: { type: String, required: true },
  kayakQuantity: { type: Number, required: true, min: 0 },
  paddleQuantity: { type: Number, required: true, min: 0 },
  duration: { type: String, required: true, enum: ['1', '2', '4', 'full'] },
  bookingDate: { type: Date },
  bookingTime: { type: String },
  totalPrice: { type: Number, required: true, min: 0 },
  status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'cancelled'] },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Add indexes for better query performance
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ bookingDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

// Validation middleware
const validateBooking = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('whatsapp').trim().isMobilePhone().withMessage('Invalid WhatsApp number'),
  body('kayakQuantity').isInt({ min: 0 }).withMessage('Invalid kayak quantity'),
  body('paddleQuantity').isInt({ min: 0 }).withMessage('Invalid paddle board quantity'),
  body('duration').isIn(['1', '2', '4', 'full']).withMessage('Invalid duration'),
  body('totalPrice').isFloat({ min: 0 }).withMessage('Invalid total price')
];

// Routes
app.post('/api/bookings', validateBooking, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = new Booking(req.body);
    await booking.save();
    
    logger.info('New booking created', { bookingId: booking._id });
    res.status(201).json(booking);
  } catch (error) {
    logger.error('Error creating booking:', error);
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;
    let query = {};

    if (status) query.status = status;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    logger.error('Error fetching bookings:', error);
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    logger.info('Booking status updated', { bookingId: id, status });
    res.json(booking);
  } catch (error) {
    logger.error('Error updating booking:', error);
    res.status(400).json({ message: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
}); 