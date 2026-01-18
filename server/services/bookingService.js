const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const WalletService = require('./walletService');
const PricingService = require('./pricingService');
const PDFService = require('./pdfService');
const fs = require('fs');
const path = require('path');

class BookingService {
  /**
   * Create a new booking with all validations (no transactions)
   * @param {Object} bookingData - { userId, flightId, passengerName }
   * @returns {Object} booking document
   */
  static async createBooking(bookingData) {
    const { userId, flightId, passengerName = 'Guest Passenger' } = bookingData;

    // 1. Get flight details
    const flight = await Flight.findOne({ flight_id: flightId });
    if (!flight) {
      throw new Error('Flight not found');
    }

    // 2. Get current price (with surge) - now returns an object
    const priceInfo = await PricingService.getCurrentPrice(flight);
    const finalPrice = priceInfo.price;

    // 3. Deduct from wallet (atomic operation)
    const deductionResult = await WalletService.deductAmount(userId, finalPrice);
    if (!deductionResult.success) {
      throw new Error(deductionResult.error || 'Payment failed');
    }

    // 4. Generate PNR
    const pnr = `PNR${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // 5. Generate PDF ticket
    let pdfBuffer;
    try {
      pdfBuffer = await PDFService.generateTicket({
        passengerName,
        airline: flight.airline,
        flightId,
        departureCity: flight.departure_city,
        arrivalCity: flight.arrival_city,
        basePrice: flight.base_price,
        finalPrice,
        bookingDate: new Date(),
        pnr
      });
    } catch (pdfError) {
      console.error('PDF generation error:', pdfError);
      // Continue without PDF if generation fails
      pdfBuffer = null;
    }

    // 6. Save PDF to disk (if generated)
    const ticketFileName = `${deductionResult.transactionId}.pdf`;
    const ticketUrl = `/tickets/${ticketFileName}`;

    if (pdfBuffer) {
      const ticketsDir = path.join(__dirname, '../../public/tickets');
      if (!fs.existsSync(ticketsDir)) {
        fs.mkdirSync(ticketsDir, { recursive: true });
      }
      fs.writeFileSync(path.join(ticketsDir, ticketFileName), pdfBuffer);
    }

    // 7. Create booking record
    const booking = await Booking.create({
      userId,
      flightId,
      airline: flight.airline,
      departureCity: flight.departure_city,
      arrivalCity: flight.arrival_city,
      passengerName,
      basePrice: flight.base_price,
      finalPrice,
      pnr,
      transactionId: deductionResult.transactionId,
      ticketUrl
    });

    return booking;
  }

  /**
   * Get user's booking history
   * @param {string} userId 
   * @returns {Array} bookings
   */
  static async getBookingHistory(userId) {
    return Booking.find({ userId })
      .sort({ bookingDate: -1 });
  }
}

module.exports = BookingService;