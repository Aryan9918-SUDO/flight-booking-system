const BookingAttempt = require('../models/BookingAttempt');
const FlightSurge = require('../models/FlightSurge');

class PricingService {
  /**
   * Record booking attempt and apply surge if needed
   * @param {string} userId - Session ID or user identifier
   * @param {string} flightId - Flight ID being booked
   * @returns {Object} { surged: boolean, multiplier: number }
   */
  static async recordAttempt(userId, flightId) {
    // 1. Record the attempt
    await BookingAttempt.create({ userId, flightId });

    // 2. Check attempts in last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const attemptCount = await BookingAttempt.countDocuments({
      userId,
      flightId,
      timestamp: { $gte: fiveMinutesAgo }
    });

    // 3. If 3+ attempts, apply surge
    if (attemptCount >= 3) {
      const tenMinutesFromNow = new Date(Date.now() + 10 * 60 * 1000);

      await FlightSurge.findOneAndUpdate(
        { flightId },
        {
          surgeMultiplier: 1.1,
          lastTriggered: new Date(),
          resetAt: tenMinutesFromNow
        },
        { upsert: true, new: true }
      );

      return { surged: true, multiplier: 1.1 };
    }

    return { surged: false, multiplier: 1.0 };
  }

  /**
   * Get current price with surge consideration
   * @param {Object} flight - Flight document
   * @returns {Object} { price, surged, surgeMultiplier, surgeExpiresAt }
   */
  static async getCurrentPrice(flight) {
    const basePrice = flight.base_price;
    const surgeRecord = await FlightSurge.findOne({
      flightId: flight.flight_id,
      resetAt: { $gt: new Date() }
    });

    if (surgeRecord) {
      return {
        price: Math.round(basePrice * surgeRecord.surgeMultiplier),
        basePrice,
        surged: true,
        surgeMultiplier: surgeRecord.surgeMultiplier,
        surgeExpiresAt: surgeRecord.resetAt.toISOString()
      };
    }

    return {
      price: basePrice,
      basePrice,
      surged: false,
      surgeMultiplier: 1.0,
      surgeExpiresAt: null
    };
  }
}

module.exports = PricingService;