import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the Trade type
export interface Trade {
  id: string;
  pair: string;
  type: 'Forex' | 'Crypto' | 'Stock';
  date: string;
  entry: number;
  exitPrice: number;
  direction: 'Long' | 'Short';
  lotSize: number;
  pnl: number;
  status: 'Win' | 'Loss' | 'BE';
  strategy?: string;
  screenshot?: string;
}

// Define the Context shape
interface TradeContextType {
  trades: Trade[];
  addTrade: (trade: Trade) => void;
  deleteTrade: (id: string) => void;
  userProfile: { name: string };
  updateProfile: (name: string) => void;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export const TradeProvider = ({ children }: { children: ReactNode }) => {
  // Load Trades from Local Storage
  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem('trades');
    return saved ? JSON.parse(saved) : [];
  });

  // Load User Profile from Local Storage
  const [userProfile, setUserProfile] = useState(() => {
     const saved = localStorage.getItem('userProfile');
     return saved ? JSON.parse(saved) : { name: "Trader" };
  });

  // Save to Local Storage whenever data changes
  useEffect(() => {
    localStorage.setItem('trades', JSON.stringify(trades));
  }, [trades]);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  const addTrade = (trade: Trade) => {
    setTrades((prev) => [trade, ...prev]);
  };

  const deleteTrade = (id: string) => {
    setTrades((prev) => prev.filter((t) => t.id !== id));
  };

  const updateProfile = (name: string) => {
    setUserProfile({ name });
  };

  return (
    <TradeContext.Provider value={{ trades, addTrade, deleteTrade, userProfile, updateProfile }}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTrades = () => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTrades must be used within a TradeProvider');
  }
  return context;
};