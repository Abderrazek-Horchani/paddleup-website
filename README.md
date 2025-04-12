# PaddleUp Website

A modern website for kayak and paddle board rentals, featuring online booking and contact management.

## Features

- Responsive design for all devices
- Online booking system
- Equipment selection and pricing
- Contact form with WhatsApp integration
- About and contact pages
- Modern UI with smooth animations

## Tech Stack

- Frontend: HTML5, CSS3, JavaScript, Bootstrap 5
- Backend: Node.js, Express.js, PostgreSQL
- Additional Tools: Font Awesome, Google Maps API

## Project Structure

```
paddleup-website/
├── index.html          # Home page
├── booking.html        # Booking page
├── about.html          # About page
├── contact.html        # Contact page
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   └── main.js         # Main JavaScript file
├── images/             # Image assets
└── backend/            # Backend server
    ├── src/
    │   ├── config/     # Configuration files
    │   ├── controllers/# Route controllers
    │   ├── models/     # Database models
    │   ├── routes/     # API routes
    │   └── utils/      # Utility functions
    ├── .env            # Environment variables
    └── package.json    # Backend dependencies
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/paddleup-website.git
   cd paddleup-website
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Set up the backend:
   ```bash
   cd backend
   npm install
   ```

4. Create a `.env` file in the backend directory with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=paddleup
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=24h
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   WHATSAPP_API_KEY=your_whatsapp_api_key
   WHATSAPP_PHONE_NUMBER=your_whatsapp_number
   FRONTEND_URL=http://localhost:3001
   ```

5. Start the development server:
   ```bash
   # Start backend
   cd backend
   npm run dev

   # Start frontend (in a new terminal)
   npm start
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or support, please contact us at:
- Email: support@paddleup.com
- Phone: +1 (555) 123-4567 