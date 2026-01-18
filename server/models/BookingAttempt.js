const mongoose = require('mongoose');

const bookingAttemptSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true,
    index: true 
  },
  flightId: { 
    type: String, 
    required: true,
    index: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    expires: '15m' // Auto-delete after 15 mins (safety margin)
  }
}, { timestamps: false });

// Compound index for efficient querying
bookingAttemptSchema.index({ userId: 1, flightId: 1, timestamp: 1 });

module.exports = mongoose.model('BookingAttempt', bookingAttemptSchema);