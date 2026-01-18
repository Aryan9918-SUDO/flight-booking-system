# ✈️ Flight Booking System

A full-stack flight booking application with dynamic surge pricing, digital wallet, and PDF ticket generation.

## 🚀 Features

- **Flight Search** - Browse and filter 20+ flights between major Indian cities
- **Dynamic Surge Pricing** - Prices increase 10% after 3 booking attempts on the same flight (with countdown timer)
- **Digital Wallet** - Pre-loaded ₹50,000 wallet with real-time balance updates
- **Booking Management** - Complete booking flow with passenger details
- **PDF Ticket Generation** - Auto-generated downloadable tickets with PNR
- **Booking History** - View all past bookings and download tickets

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - API calls
- **Context API** - State management (Auth & Wallet)

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Database
- **Mongoose** - ODM
- **PDFKit** - PDF generation
- **express-rate-limit** - Rate limiting

## 📁 Project Structure

```
flight-booking-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── FlightCard.jsx
│   │   │   ├── FlightSearch.jsx
│   │   │   ├── BookingForm.jsx
│   │   │   └── Navbar.jsx
│   │   ├── context/        # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── WalletContext.jsx
│   │   ├── pages/          # Page components
│   │   │   └── BookingHistory.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                 # Express backend
│   ├── models/             # Mongoose schemas
│   │   ├── Flight.js
│   │   ├── Booking.js
│   │   ├── Wallet.js
│   │   ├── FlightSurge.js
│   │   └── BookingAttempt.js
│   ├── routes/             # API routes
│   │   ├── flights.js
│   │   ├── bookings.js
│   │   └── wallet.js
│   ├── services/           # Business logic
│   │   ├── bookingService.js
│   │   ├── pricingService.js
│   │   ├── walletService.js
│   │   └── pdfService.js
│   ├── server.js
│   └── package.json
│
└── public/tickets/         # Generated PDF tickets
```

## ⚙️ Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/Aryan9918-SUDO/flight-booking-system.git
cd flight-booking-system
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/flight-booking
PORT=5000
```

### 3. Setup Frontend
```bash
cd ../client
npm install
```

Create a `.env` file in the `client` folder:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Seed the Database (First time only)
```bash
cd server
node seedFlights.js
```

## 🏃 Running the Application

### Start Backend Server
```bash
cd server
node server.js
```
Server runs at: `http://localhost:5000`

### Start Frontend (in a new terminal)
```bash
cd client
npm run dev
```
Frontend runs at: `http://localhost:5173`

## 🎮 How to Use

1. **Browse Flights** - View all available flights on the home page
2. **Filter & Sort** - Use dropdowns to filter by city or sort by price
3. **Book a Flight** - Click "Book Flight" and enter passenger name
4. **Trigger Surge** - Click on the same flight 3+ times to see surge pricing with countdown timer
5. **View History** - Click "My Bookings" in navbar to see past bookings
6. **Download Ticket** - Click "Download Ticket" from booking history

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/flights` | Get all flights |
| GET | `/api/bookings/price/:flightId` | Get current price with surge |
| POST | `/api/bookings/attempt` | Record booking attempt |
| POST | `/api/bookings` | Create new booking |
| GET | `/api/bookings/history/:userId` | Get user's booking history |
| GET | `/api/bookings/ticket/:bookingId` | Download ticket PDF |
| GET | `/api/wallet` | Get wallet balance |
| POST | `/api/wallet/deduct` | Deduct from wallet |

## 🔒 Rate Limiting

- **Wallet operations**: 100 requests per 15 minutes
- **Booking operations**: 10 bookings per 15 minutes (POST only)

## 📝 License

MIT License - feel free to use this project for learning and development.

---

Built with ❤️ by Aryan Singh
