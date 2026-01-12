require('dotenv').config();
const mongoose = require('mongoose');
const Flight = require('./models/Flight');

const flightsData = [
  { flight_id: 'FL001', airline: 'Air India', departure_city: 'Mumbai', arrival_city: 'Delhi', base_price: 2500 },
  { flight_id: 'FL002', airline: 'IndiGo', departure_city: 'Delhi', arrival_city: 'Bangalore', base_price: 2200 },
  { flight_id: 'FL003', airline: 'Vistara', departure_city: 'Chennai', arrival_city: 'Kolkata', base_price: 2800 },
  { flight_id: 'FL004', airline: 'SpiceJet', departure_city: 'Hyderabad', arrival_city: 'Mumbai', base_price: 2300 },
  { flight_id: 'FL005', airline: 'GoFirst', departure_city: 'Bangalore', arrival_city: 'Delhi', base_price: 2600 },
  { flight_id: 'FL006', airline: 'Air India', departure_city: 'Kolkata', arrival_city: 'Chennai', base_price: 2100 },
  { flight_id: 'FL007', airline: 'IndiGo', departure_city: 'Mumbai', arrival_city: 'Hyderabad', base_price: 2400 },
  { flight_id: 'FL008', airline: 'Vistara', departure_city: 'Delhi', arrival_city: 'Chennai', base_price: 2900 },
  { flight_id: 'FL009', airline: 'SpiceJet', departure_city: 'Bangalore', arrival_city: 'Kolkata', base_price: 2700 },
  { flight_id: 'FL010', airline: 'GoFirst', departure_city: 'Chennai', arrival_city: 'Mumbai', base_price: 3000 },
  { flight_id: 'FL011', airline: 'Air India', departure_city: 'Hyderabad', arrival_city: 'Delhi', base_price: 2200 },
  { flight_id: 'FL012', airline: 'IndiGo', departure_city: 'Kolkata', arrival_city: 'Bangalore', base_price: 2500 },
  { flight_id: 'FL013', airline: 'Vistara', departure_city: 'Mumbai', arrival_city: 'Chennai', base_price: 2300 },
  { flight_id: 'FL014', airline: 'SpiceJet', departure_city: 'Delhi', arrival_city: 'Hyderabad', base_price: 2600 },
  { flight_id: 'FL015', airline: 'GoFirst', departure_city: 'Chennai', arrival_city: 'Bangalore', base_price: 2800 },
  { flight_id: 'FL016', airline: 'Air India', departure_city: 'Bangalore', arrival_city: 'Mumbai', base_price: 2400 },
  { flight_id: 'FL017', airline: 'IndiGo', departure_city: 'Hyderabad', arrival_city: 'Kolkata', base_price: 2700 },
  { flight_id: 'FL018', airline: 'Vistara', departure_city: 'Kolkata', arrival_city: 'Delhi', base_price: 2900 },
  { flight_id: 'FL019', airline: 'SpiceJet', departure_city: 'Mumbai', arrival_city: 'Bangalore', base_price: 3000 },
  { flight_id: 'FL020', airline: 'GoFirst', departure_city: 'Delhi', arrival_city: 'Mumbai', base_price: 2000 }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Flight.deleteMany({});
    await Flight.insertMany(flightsData);
    console.log('✅ Successfully seeded 20 flights');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();