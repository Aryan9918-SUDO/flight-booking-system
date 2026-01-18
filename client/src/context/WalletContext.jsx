import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const { sessionId } = useAuth();
  const [balance, setBalance] = useState(50000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/wallet`,
          { params: { userId: sessionId } }
        );
        setBalance(response.data.balance);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch wallet balance:', err);
        setError('Failed to load wallet');
        setBalance(50000); // Fallback to default
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [sessionId]);

  // Deduct amount from wallet
  const deductAmount = async (amount) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/wallet/deduct`,
        { userId: sessionId, amount }
      );
      
      setBalance(response.data.newBalance);
      return { success: true, transactionId: response.data.transactionId };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Deduction failed';
      setError(errorMessage);
      
      // Refresh balance after failed attempt
      const balanceRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/wallet`,
        { params: { userId: sessionId } }
      );
      setBalance(balanceRes.data.balance);
      
      return { 
        success: false, 
        error: errorMessage,
        code: error.response?.data?.code 
      };
    }
  };

  return (
    <WalletContext.Provider value={{ 
      balance, 
      loading, 
      error, 
      deductAmount,
      refreshBalance: () => { /* Implemented later */ }
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}