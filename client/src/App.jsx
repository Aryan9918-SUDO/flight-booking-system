
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FlightSearch from './components/FlightSearch';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-blue-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Flight Booking System</h1>
            <div className="font-medium">Wallet: ₹50,000</div>
          </div>
        </nav>
        <main className="py-8">
          <Routes>
            <Route path="/" element={<FlightSearch />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;