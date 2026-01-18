const mongoose = require('mongoose');
const crypto = require('crypto');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    flightId: {
        type: String,
        required: true
    },
    airline: {
        type: String,
        required: true
    },
    departureCity: {
        type: String,
        required: true
    },
    arrivalCity: {
        type: String,
        required: true
    },
    passengerName: {
        type: String,
        required: true,
        default: 'Guest Passenger'
    },
    basePrice: {
        type: Number,
        required: true
    },
    finalPrice: {
        type: Number,
        required: true
    },
    pnr: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    transactionId: {
        type: String,
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    ticketUrl: {
        type: String
    } // For cloud storage (optional)
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);