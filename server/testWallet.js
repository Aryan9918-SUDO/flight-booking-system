const mongoose = require('mongoose');
require('dotenv').config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const Wallet = require('./models/Wallet');

        // Try to find or create wallet
        let wallet = await Wallet.findOne({ userId: 'test_session_123' });
        console.log('Found wallet:', wallet);

        if (!wallet) {
            wallet = await Wallet.create({ userId: 'test_session_123', balance: 50000 });
            console.log('Created new wallet:', wallet);
        }

        console.log('Wallet balance:', wallet.balance);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

test();
