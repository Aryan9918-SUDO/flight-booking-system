const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    balance: {
        type: Number,
        required: true,
        default: 50000, // Default ₹50,000
        min: 0 // Prevent negative balances
    },
    currency: {
        type: String,
        default: 'INR'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);