const express = require('express');
const router = express.Router();
const WalletService = require('../services/walletService');

// GET /api/wallet - Get wallet balance
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const balance = await WalletService.getBalance(userId);
        res.json({ balance, currency: 'INR' });
    } catch (error) {
        console.error('Wallet GET error:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// POST /api/wallet/deduct - Deduct amount
router.post('/deduct', async (req, res) => {
    try {
        const { userId, amount } = req.body;

        if (!userId || !amount) {
            return res.status(400).json({ error: 'userId and amount are required' });
        }

        const result = await WalletService.deductAmount(userId, amount);

        if (!result.success) {
            return res.status(400).json({
                error: result.error,
                code: 'INSUFFICIENT_BALANCE'
            });
        }

        res.json(result);
    } catch (error) {
        console.error('Wallet deduct error:', error);
        res.status(500).json({ error: 'Deduction failed', details: error.message });
    }
});

module.exports = router;