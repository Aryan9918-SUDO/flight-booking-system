const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    flight_id: {
        type: String,
        required: true,
        unique: true,
        match: [/^FL\d{3}$/, 'Invalid flight ID format']
    },
    airline: {
        type: String,
        required: true,
        enum: ['Air India', 'IndiGo', 'Vistara', 'SpiceJet', 'GoFirst']
    },
    departure_city: {
        type: String,
        required: true,
        enum: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad']
    },
    arrival_city: {
        type: String,
        required: true,
        enum: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad']
    },
    base_price: {
        type: Number,
        required: true,
        min: 2000,
        max: 3000
    }
}, { timestamps: true });

// Method to get current price with surge pricing
flightSchema.methods.getCurrentPrice = async function () {
    const surgeRecord = await mongoose.model('FlightSurge').findOne({
        flightId: this.flight_id,
        resetAt: { $gt: new Date() } // Only active surges
    });

    return surgeRecord
        ? Math.round(this.base_price * surgeRecord.surgeMultiplier)
        : this.base_price;
};

module.exports = mongoose.model('Flight', flightSchema);