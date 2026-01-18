const express = require('express');
const router = express.Router();
const path = require('path');
const BookingService = require('../services/bookingService');
const PricingService = require('../services/pricingService');
const Booking = require('../models/Booking');

// POST /api/bookings/attempt - Record booking attempt for surge pricing
router.post('/attempt', async (req, res) => {
  const { userId, flightId } = req.body;

  if (!userId || !flightId) {
    return res.status(400).json({
      error: 'userId and flightId are required'
    });
  }

  try {
    const result = await PricingService.recordAttempt(userId, flightId);
    res.json(result);
  } catch (error) {
    console.error('Booking attempt error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/bookings/price/:flightId - Get current price with surge info
router.get('/price/:flightId', async (req, res) => {
  try {
    const Flight = require('../models/Flight');
    const flight = await Flight.findOne({ flight_id: req.params.flightId });

    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    const priceInfo = await PricingService.getCurrentPrice(flight);
    res.json(priceInfo);
  } catch (error) {
    console.error('Price fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// NEW: Create booking
router.post('/', async (req, res) => {
  try {
    const { userId, flightId, passengerName } = req.body;

    if (!userId || !flightId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const booking = await BookingService.createBooking({
      userId,
      flightId,
      passengerName
    });

    res.status(201).json({
      success: true,
      bookingId: booking._id,
      pnr: booking.pnr,
      ticketUrl: booking.ticketUrl
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Booking failed'
    });
  }
});

// NEW: Get booking history
router.get('/history/:userId', async (req, res) => {
  try {
    const bookings = await BookingService.getBookingHistory(req.params.userId);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// NEW: Get ticket PDF with validation
router.get('/ticket/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Build the correct path - tickets are stored in server/public/tickets/
    const fs = require('fs');
    const ticketFileName = booking.ticketUrl.replace('/tickets/', '');
    const pdfPath = path.join(__dirname, '../public/tickets', ticketFileName);

    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({
        error: 'Ticket file not found. Please contact support.',
        path: pdfPath
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket_${booking.pnr}.pdf`);
    res.download(pdfPath);
  } catch (error) {
    console.error('Ticket download error:', error);
    res.status(500).json({ error: 'Failed to download ticket' });
  }
});

module.exports = router;