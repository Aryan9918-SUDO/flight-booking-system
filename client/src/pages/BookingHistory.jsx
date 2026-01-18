import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { sessionId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/bookings/history/${sessionId}`
        );
        setBookings(response.data);
      } catch (err) {
        console.error('Failed to fetch booking history:', err);
        setError('Failed to load booking history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [sessionId]);

  const downloadTicket = (bookingId) => {
    window.open(
      `${import.meta.env.VITE_API_BASE_URL}/api/bookings/ticket/${bookingId}`,
      '_blank'
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading your booking history...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Booking History</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center"
        >
          <span className="mr-2">←</span> Book New Flight
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow text-center py-16">
          <div className="text-5xl mb-4 text-gray-300">🎫</div>
          <h2 className="text-xl font-bold mb-2">No bookings found</h2>
          <p className="text-gray-500 mb-4">You haven't made any bookings yet</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Book Your First Flight
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div 
              key={booking._id} 
              className="bg-white rounded-lg shadow overflow-hidden border border-gray-100"
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                        CONFIRMED
                      </span>
                      <span className="font-mono font-bold text-lg">{booking.pnr}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{booking.airline}</h3>
                    <p className="text-gray-600 font-mono">{booking.flightId}</p>
                  </div>
                  
                  <div className="text-right mb-4 md:mb-0">
                    <div className="text-2xl font-bold text-green-600">
                      ₹{booking.finalPrice.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(booking.bookingDate).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 py-3 bg-blue-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-bold text-lg">{booking.departureCity}</div>
                    <div className="text-blue-600 font-bold my-1 text-xl">→</div>
                    <div className="font-bold text-lg">{booking.arrivalCity}</div>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div>
                    <div className="font-medium">Passenger:</div>
                    <div className="text-gray-700">{booking.passengerName}</div>
                  </div>
                  
                  <button
                    onClick={() => downloadTicket(booking._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center transition"
                  >
                    <span className="mr-2">↓</span> Download Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Tickets are valid for 1 year from booking date</p>
        <p className="mt-1">Contact support@xtechon-flights.com for assistance</p>
      </div>
    </div>
  );
}