import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- TYPES ---
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

export interface Goal {
  id: string;
  text: string;
  deadline: string;
  completed: boolean;
}

interface TradeContextType {
  trades: Trade[];
  addTrade: (trade: Trade) => void;
  deleteTrade: (id: string) => void;
  
  userProfile: { name: string };
  updateProfile: (name: string) => void;

  goals: Goal[];
  addGoal: (goal: Goal) => void;
  toggleGoal: (id: string) => void;
  deleteGoal: (id: string) => void;
}

// --- CONTEXT ---
const TradeContext = createContext<TradeContextType | undefined>(undefined);

// --- PROVIDER ---
export const TradeProvider = ({ children }: { children: ReactNode }) => {
  // 1. Trades
  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem('trades');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Profile
  const [userProfile, setUserProfile] = useState(() => {
     const saved = localStorage.getItem('userProfile');
     return saved ? JSON.parse(saved) : { name: "Trader" };
  });

  // 3. Goals
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : [];
  });

  // --- PERSISTENCE ---
  useEffect(() => { localStorage.setItem('trades', JSON.stringify(trades)); }, [trades]);
  useEffect(() => { localStorage.setItem('userProfile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('goals', JSON.stringify(goals)); }, [goals]);

  // --- ACTIONS ---
  const addTrade = (trade: Trade) => setTrades((prev) => [trade, ...prev]);
  const deleteTrade = (id: string) => setTrades((prev) => prev.filter((t) => t.id !== id));
  
  const updateProfile = (name: string) => setUserProfile({ name });

  const addGoal = (goal: Goal) => setGoals((prev) => [...prev, goal]);
  const toggleGoal = (id: string) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };
  const deleteGoal = (id: string) => setGoals(prev => prev.filter(g => g.id !== id));

  return (
    <TradeContext.Provider value={{ 
      trades, addTrade, deleteTrade, 
      userProfile, updateProfile,
      goals, addGoal, toggleGoal, deleteGoal 
    }}>
      {children}
    </TradeContext.Provider>
  );
};

// --- HOOK ---
export const useTrades = () => {
  const context = useContext(TradeContext);
  if (!context) throw new Error('useTrades must be used within a TradeProvider');
  return context;
};