# PaddleUp Backend

This is the backend server for the PaddleUp website, handling booking management, user authentication, and communication services.

## Features

- Booking management system
- User authentication and authorization
- Email notifications
- WhatsApp integration for booking confirmations
- Database storage for bookings and users
- API endpoints for frontend integration

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/paddleup-website.git
cd paddleup-website/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration values.

5. Initialize the database:
```bash
npm run db:migrate
```

## Development

To start the development server:

```bash
npm run dev
```

The server will start on http://localhost:3000

## Production

To build and start the production server:

```bash
npm run build
npm start
```

## API Documentation

The API documentation is available at `/api-docs` when the server is running.

## Testing

To run tests:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 