import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { balance, loading, error } = useWallet();
  const { sessionId } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center hover:opacity-90 transition">
          <span className="mr-2">✈️</span>
          Flight Booking System
        </Link>

        <div className="flex items-center space-x-4">
          {/* Navigation Links */}
          <Link
            to="/"
            className={`px-3 py-1.5 rounded transition ${location.pathname === '/'
                ? 'bg-white text-blue-600 font-medium'
                : 'hover:bg-blue-500'
              }`}
          >
            🏠 Flights
          </Link>
          <Link
            to="/history"
            className={`px-3 py-1.5 rounded transition ${location.pathname === '/history'
                ? 'bg-white text-blue-600 font-medium'
                : 'hover:bg-blue-500'
              }`}
          >
            📋 My Bookings
          </Link>

          {error && (
            <div className="text-yellow-200 text-sm animate-pulse">
              {error}
            </div>
          )}

          <div className="bg-blue-700 px-4 py-2 rounded-lg font-medium flex items-center">
            <span className="mr-2">💰</span>
            {loading ? (
              <div className="h-5 w-20 bg-blue-800 rounded animate-pulse"></div>
            ) : (
              <>
                <span>Wallet:</span>
                <span className="ml-1 font-bold text-lg">
                  ₹{balance.toLocaleString('en-IN')}
                </span>
              </>
            )}
          </div>

          {/* Session ID for debugging (remove in production) */}
          <div className="text-xs opacity-75 hidden md:block">
            Session: {sessionId.substring(0, 6)}...
          </div>
        </div>
      </div>
    </nav>
  );
}