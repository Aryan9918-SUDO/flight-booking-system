const Wallet = require('../models/Wallet');

class WalletService {
    /**
     * Get or create wallet for user
     * @param {string} userId 
     * @returns {Object} wallet document
     */
    static async getOrCreateWallet(userId) {
        let wallet = await Wallet.findOne({ userId });

        if (!wallet) {
            wallet = await Wallet.create({
                userId,
                balance: 50000 // Default balance
            });
        }

        return wallet;
    }

    /**
     * Deduct amount from wallet (atomic operation without transactions)
     * @param {string} userId 
     * @param {number} amount 
     * @returns {Object} { success, newBalance, error }
     */
    static async deductAmount(userId, amount) {
        if (amount <= 0) {
            return { success: false, error: 'Invalid amount' };
        }

        try {
            // Ensure wallet exists first
            await this.getOrCreateWallet(userId);

            // Atomic update - only succeeds if balance >= amount
            const wallet = await Wallet.findOneAndUpdate(
                { userId, balance: { $gte: amount } },
                {
                    $inc: { balance: -amount },
                    $set: { lastUpdated: new Date() }
                },
                { new: true, runValidators: true }
            );

            if (!wallet) {
                const currentBalance = await this.getBalance(userId);
                return {
                    success: false,
                    error: `Insufficient wallet balance. Current balance: ₹${currentBalance.toLocaleString('en-IN')}`
                };
            }

            return {
                success: true,
                newBalance: wallet.balance,
                transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
            };
        } catch (error) {
            console.error('Wallet deduction error:', error);
            return { success: false, error: error.message || 'Transaction failed' };
        }
    }

    /**
     * Get current balance
     * @param {string} userId 
     * @returns {number} balance
     */
    static async getBalance(userId) {
        const wallet = await this.getOrCreateWallet(userId);
        return wallet.balance;
    }
}

module.exports = WalletService;