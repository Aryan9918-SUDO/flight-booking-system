import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BookingForm({ flight, onClose }) {
  const [passengerName, setPassengerName] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!passengerName.trim()) {
      setError('Passenger name is required');
      return;
    }

    setIsBooking(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: sessionStorage.getItem('sessionId') || localStorage.getItem('flight_session'),
          flightId: flight.flight_id,
          passengerName: passengerName.trim()
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Booking failed');
      }

      setBookingResult(data);

      // Note: Ticket will be viewable from booking history
      // Auto redirect to history after 2 seconds
      setTimeout(() => {
        navigate('/history');
      }, 2000);

    } catch (error) {
      console.error('Booking error:', error);
      setError(error.message || 'Failed to complete booking');
    } finally {
      setIsBooking(false);
    }
  };

  if (bookingResult) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 text-5xl mb-4">✅</div>
        <h3 className="text-xl font-bold mb-2">Booking Confirmed!</h3>
        <p className="mb-1">PNR: <span className="font-mono font-bold">{bookingResult.pnr}</span></p>
        <p className="mb-4">Flight: {flight.flight_id} ({flight.airline})</p>
        <p className="mb-4 text-sm text-gray-600">You will be redirected to booking history...</p>
        <div className="space-x-4">
          <button
            onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/ticket/${bookingResult.bookingId}`, '_blank')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Download Ticket
          </button>
          <button
            onClick={() => navigate('/history')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            View Booking History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Book Flight</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between mb-2">
          <div>
            <div className="font-bold">{flight.departure_city}</div>
            <div className="text-sm text-gray-500">Departure</div>
          </div>
          <div className="text-blue-600 font-bold text-xl">→</div>
          <div className="text-right">
            <div className="font-bold">{flight.arrival_city}</div>
            <div className="text-sm text-gray-500">Arrival</div>
          </div>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <div>
            <div className="font-mono font-bold text-lg">{flight.flight_id}</div>
            <div className="text-sm">{flight.airline}</div>
          </div>
          <div className={`text-2xl font-bold ${flight.current_price > flight.base_price
            ? 'text-red-600'
            : 'text-green-600'
            }`}>
            ₹{flight.current_price.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Passenger Name</label>
          <input
            type="text"
            value={passengerName}
            onChange={(e) => setPassengerName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter full name as per ID"
            required
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isBooking}
          className={`w-full py-3 rounded-lg font-bold text-white ${isBooking
            ? 'bg-yellow-400'
            : flight.current_price > flight.base_price
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
            } transition flex items-center justify-center`}
        >
          {isBooking ? (
            <>
              <span className="animate-spin mr-2">🔄</span>
              Processing Booking...
            </>
          ) : (
            'Confirm Booking'
          )}
        </button>
      </form>

      <p className="mt-4 text-xs text-gray-500 text-center">
        By booking, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}