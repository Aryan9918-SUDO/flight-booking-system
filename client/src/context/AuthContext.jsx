import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [sessionId, setSessionId] = useState(() => {
    // Get existing session or create new
    return localStorage.getItem('flight_session') || 
           `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  });

  useEffect(() => {
    localStorage.setItem('flight_session', sessionId);
  }, [sessionId]);

  return (
    <AuthContext.Provider value={{ sessionId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}