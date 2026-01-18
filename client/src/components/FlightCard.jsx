import { useState, useEffect } from 'react';

// Countdown Timer Component
function SurgeCountdown({ expiresAt }) {
    const [timeLeft, setTimeLeft] = useState('');
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (!expiresAt) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const expiry = new Date(expiresAt).getTime();
            const difference = expiry - now;

            if (difference <= 0) {
                setIsExpired(true);
                setTimeLeft('Expired');
                return;
            }

            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            setTimeLeft(`${minutes}m ${seconds}s`);
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [expiresAt]);

    if (isExpired || !expiresAt) return null;

    return (
        <div className="bg-red-100 border border-red-300 rounded-lg px-3 py-2 mt-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <span className="text-red-600 animate-pulse mr-2">🔥</span>
                    <span className="text-red-700 font-medium text-sm">Surge Active!</span>
                </div>
                <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                    {timeLeft}
                </div>
            </div>
            <div className="text-xs text-red-600 mt-1">
                Price increases by 10% due to high demand
            </div>
        </div>
    );
}

export default function FlightCard({ flight, balance, onBook }) {
    const [isBooking, setIsBooking] = useState(false);
    const [error, setError] = useState(null);

    const hasSurge = flight.surged && flight.surgeExpiresAt;

    const handleBookClick = async () => {
        setError(null);

        // UI-level balance check (for instant feedback)
        if (balance < flight.current_price) {
            setError(`Insufficient funds! You need ₹${flight.current_price.toLocaleString('en-IN')} but have ₹${balance.toLocaleString('en-IN')}`);
            return;
        }

        setIsBooking(true);
        try {
            onBook(flight); // Parent handles surge attempt + wallet deduction
        } catch (error) {
            console.error('Booking initiation failed:', error);
            setError('Failed to start booking process');
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className={`border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow h-full flex flex-col ${hasSurge ? 'border-red-300 bg-red-50/30' : 'bg-white'}`}>
            {/* Header with airline and price */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-gray-800">{flight.airline}</h3>
                    <p className="text-gray-600 font-mono text-sm">{flight.flight_id}</p>
                </div>
                <div className="text-right">
                    <div className="flex items-baseline">
                        {flight.current_price > flight.base_price && (
                            <span className="text-gray-500 line-through text-sm mr-1">
                                ₹{flight.base_price.toLocaleString('en-IN')}
                            </span>
                        )}
                        <span className={`text-2xl font-bold ${flight.current_price > flight.base_price
                            ? 'text-red-600'
                            : 'text-green-600'
                            }`}>
                            ₹{flight.current_price.toLocaleString('en-IN')}
                        </span>
                    </div>

                    {flight.current_price > flight.base_price && (
                        <div className="text-xs text-red-500 mt-1 flex items-center justify-end">
                            <span className="mr-1">▲10% surge</span>
                            <span className="animate-pulse">•</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Surge Countdown Timer */}
            {hasSurge && <SurgeCountdown expiresAt={flight.surgeExpiresAt} />}

            {/* Route Display */}
            <div className="mt-3 py-3 bg-blue-50 rounded flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="font-bold text-lg text-gray-800">{flight.departure_city}</div>
                    <div className="text-blue-600 font-bold my-1">→</div>
                    <div className="font-bold text-lg text-gray-800">{flight.arrival_city}</div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded border border-red-200">
                    {error}
                </div>
            )}

            {/* Book Button */}
            <button
                onClick={handleBookClick}
                disabled={isBooking || balance < flight.current_price}
                className={`mt-4 w-full py-3 rounded font-bold transition ${balance < flight.current_price
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isBooking
                        ? 'bg-yellow-400'
                        : flight.current_price > flight.base_price
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                    } text-white flex items-center justify-center`}
            >
                {isBooking ? (
                    <>
                        <span className="animate-spin mr-2">🔄</span>
                        Processing...
                    </>
                ) : balance < flight.current_price ? (
                    'Insufficient Funds'
                ) : flight.current_price > flight.base_price ? (
                    '⚡ Book at Surged Price'
                ) : (
                    'Book Flight'
                )}
            </button>
        </div>
    );
}