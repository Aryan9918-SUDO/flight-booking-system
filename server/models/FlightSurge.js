const mongoose = require('mongoose');

const flightSurgeSchema = new mongoose.Schema({
  flightId: { 
    type: String, 
    required: true,
    unique: true 
  },
  surgeMultiplier: { 
    type: Number, 
    default: 1.1 // 10% increase
  },
  lastTriggered: { 
    type: Date, 
    default: Date.now 
  },
  resetAt: { 
    type: Date, 
    required: true 
  }
}, { timestamps: false });

// Auto-remove surge records after reset time + buffer
flightSurgeSchema.index({ resetAt: 1 }, { expireAfterSeconds: 60 });

module.exports = mongoose.model('FlightSurge', flightSurgeSchema);