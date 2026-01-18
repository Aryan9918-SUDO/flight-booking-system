require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const rateLimit = require('express-rate-limit');

// Wallet-specific rate limiter
const walletLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 wallet operations per windowMs
    message: 'Too many wallet requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply to wallet routes
app.use('/api/wallet', walletLimiter);

// Booking-specific rate limiter (only for POST - actual bookings)
const bookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit to 10 bookings per window to prevent abuse
    message: 'Too many bookings, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method !== 'POST', // Only limit POST requests
});

// Apply to booking routes
app.use('/api/bookings', bookingLimiter);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Add after mongoose connection
const flightRoutes = require('./routes/flights');
app.use('/api/flights', flightRoutes);

// Test Route
app.get('/', (req, res) => {
    res.json({ message: 'Flight Booking API Running' });
});


const bookingRoutes = require('./routes/bookings');
app.use('/api/bookings', bookingRoutes);

const walletRoutes = require('./routes/wallet');
app.use('/api/wallet', walletRoutes);

// Add static file serving for tickets
const path = require('path');
app.use('/tickets', express.static(path.join(__dirname, 'public', 'tickets')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});