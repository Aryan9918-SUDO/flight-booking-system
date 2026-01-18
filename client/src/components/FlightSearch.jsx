import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import FlightCard from './FlightCard';
import BookingForm from './BookingForm';

// Available cities for filtering
const CITIES = ['All', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];

export default function FlightSearch() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const { sessionId } = useAuth();
    const { balance } = useWallet();

    // Filter & Sort states
    const [departureFilter, setDepartureFilter] = useState('All');
    const [arrivalFilter, setArrivalFilter] = useState('All');
    const [sortBy, setSortBy] = useState('price-low'); // 'price-low', 'price-high', 'airline'
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/flights`
                );

                const flightsWithPrices = await Promise.all(
                    response.data.map(async (flight) => {
                        const priceRes = await axios.get(
                            `${import.meta.env.VITE_API_BASE_URL}/api/bookings/price/${flight.flight_id}`
                        );
                        return {
                            ...flight,
                            current_price: priceRes.data.price,
                            surged: priceRes.data.surged,
                            surgeExpiresAt: priceRes.data.surgeExpiresAt
                        };
                    })
                );

                setFlights(flightsWithPrices);
            } catch (error) {
                console.error('Error fetching flights:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, [sessionId]);

    // Filtered and sorted flights using useMemo for performance
    const filteredFlights = useMemo(() => {
        let result = [...flights];

        // Apply departure filter
        if (departureFilter !== 'All') {
            result = result.filter(f => f.departure_city === departureFilter);
        }

        // Apply arrival filter
        if (arrivalFilter !== 'All') {
            result = result.filter(f => f.arrival_city === arrivalFilter);
        }

        // Apply sorting
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.current_price - b.current_price);
                break;
            case 'price-high':
                result.sort((a, b) => b.current_price - a.current_price);
                break;
            case 'airline':
                result.sort((a, b) => a.airline.localeCompare(b.airline));
                break;
            default:
                break;
        }

        return result;
    }, [flights, departureFilter, arrivalFilter, sortBy]);

    // Reset filters
    const resetFilters = () => {
        setDepartureFilter('All');
        setArrivalFilter('All');
        setSortBy('price-low');
    };

    // Open booking modal
    const handleBooking = (flight) => {
        setSelectedFlight(flight);
    };

    if (loading) return (
        <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading flight inventory...</p>
        </div>
    );

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
                Available Flights
            </h2>

            {/* Filter Toggle Button (Mobile) */}
            <div className="md:hidden mb-4">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-lg font-medium flex items-center justify-center"
                >
                    <span className="mr-2">🔍</span>
                    {showFilters ? 'Hide Filters' : 'Show Filters & Sort'}
                </button>
            </div>

            {/* Filters & Sort Section */}
            <div className={`bg-white rounded-lg shadow-md p-4 mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Departure City Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            From (Departure)
                        </label>
                        <select
                            value={departureFilter}
                            onChange={(e) => setDepartureFilter(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {CITIES.map(city => (
                                <option key={`dep-${city}`} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    {/* Arrival City Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            To (Arrival)
                        </label>
                        <select
                            value={arrivalFilter}
                            onChange={(e) => setArrivalFilter(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {CITIES.map(city => (
                                <option key={`arr-${city}`} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort By */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sort By
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="airline">Airline Name</option>
                        </select>
                    </div>

                    {/* Reset Button */}
                    <div className="flex items-end">
                        <button
                            onClick={resetFilters}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>

                {/* Active Filters Summary */}
                {(departureFilter !== 'All' || arrivalFilter !== 'All') && (
                    <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
                        <span className="font-medium">Active filters:</span>
                        {departureFilter !== 'All' && (
                            <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                From: {departureFilter}
                            </span>
                        )}
                        {arrivalFilter !== 'All' && (
                            <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                To: {arrivalFilter}
                            </span>
                        )}
                        <span className="ml-3 text-gray-500">
                            ({filteredFlights.length} of {flights.length} flights)
                        </span>
                    </div>
                )}
            </div>

            {/* Flight Results */}
            {filteredFlights.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <div className="text-5xl mb-4">✈️</div>
                    <p className="text-xl text-gray-500 mb-2">No flights found</p>
                    <p className="text-gray-400 mb-4">Try adjusting your filters</p>
                    <button
                        onClick={resetFilters}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                    >
                        Show All Flights
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFlights.map(flight => (
                        <FlightCard
                            key={flight._id}
                            flight={flight}
                            balance={balance}
                            onBook={() => handleBooking(flight)}
                        />
                    ))}
                </div>
            )}

            {/* Booking Modal */}
            {selectedFlight && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="w-full max-w-md">
                        <BookingForm
                            flight={selectedFlight}
                            onClose={() => setSelectedFlight(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}