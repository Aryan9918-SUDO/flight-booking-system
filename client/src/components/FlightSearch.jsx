import { useState, useEffect } from 'react';
import axios from 'axios';

export default function FlightSearch() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/flights`);
        setFlights(response.data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlights();
  }, []);

  if (loading) return <div className="text-center py-10">Loading flights...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Available Flights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flights.map(flight => (
          <div key={flight._id} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{flight.airline}</h3>
                <p className="text-gray-600">{flight.flight_id}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                ₹{flight.base_price}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-center">
                <span className="font-medium">{flight.departure_city}</span>
                <span className="mx-2">→</span>
                <span className="font-medium">{flight.arrival_city}</span>
              </div>
            </div>
            <button 
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              onClick={() => console.log('Booking', flight.flight_id)}
            >
              Book Flight
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}