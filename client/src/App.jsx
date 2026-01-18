import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FlightSearch from './components/FlightSearch';
import Navbar from './components/Navbar';
import BookingHistory from './pages/BookingHistory'; // New import

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow py-6">
          <Routes>
            <Route path="/" element={<FlightSearch />} />
            <Route path="/history" element={<BookingHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;