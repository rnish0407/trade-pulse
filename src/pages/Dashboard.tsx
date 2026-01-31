import React, { useState } from 'react';
import { useTrades } from '../store';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Target, CheckSquare, Square, Trash2, 
  TrendingUp, Activity, Wallet 
} from 'lucide-react';

const Dashboard = () => {
  const { userProfile, goals, addGoal, toggleGoal, deleteGoal, trades } = useTrades();
  const navigate = useNavigate();

  // Stats Logic
  const netPnL = trades.reduce((acc, curr) => acc + curr.pnl, 0);
  const winRate = trades.length > 0 
    ? Math.round((trades.filter(t => t.pnl > 0).length / trades.length) * 100) 
    : 0;

  // Goal Form State
  const [goalText, setGoalText] = useState("");
  const [goalDate, setGoalDate] = useState("");

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalText || !goalDate) return;
    
    addGoal({
      id: crypto.randomUUID(),
      text: goalText,
      deadline: goalDate,
      completed: false
    });
    setGoalText("");
    setGoalDate("");
  };

  return (
    <div className="space-y-10">
      
      {/* 1. HEADER & BRANDING */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tighter" style={{ fontFamily: '"Inter", sans-serif' }}>
            TradePulse
          </h1>
          <p className="text-gray-400 text-xl mt-2 font-light">
            Hello, <span className="text-white font-semibold">{userProfile.name}</span>
          </p>
        </div>

        {/* Trade Entry Button */}
        <button 
          onClick={() => navigate('/trade-log')}
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-1 flex items-center gap-2 text-lg"
        >
          <Plus className="stroke-[3px]" /> New Entry
        </button>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Wallet size={18} /> Net P&L
          </div>
          <div className={`text-4xl font-bold ${netPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {netPnL >= 0 ? '+' : ''}${netPnL.toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Activity size={18} /> Win Rate
          </div>
          <div className="text-4xl font-bold text-white">{winRate}%</div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <TrendingUp size={18} /> Total Trades
          </div>
          <div className="text-4xl font-bold text-white">{trades.length}</div>
        </div>
      </div>

      {/* 3. GOAL TRACKER SECTION */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
        <div className="bg-gray-900/50 p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Target className="text-purple-400" /> Goals & Targets
          </h2>
        </div>

        <div className="p-8 space-y-8">
          {/* Input Area */}
          <form onSubmit={handleAddGoal} className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Write a goal (e.g. Follow plan 100%)" 
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              className="flex-1 bg-gray-900 text-white p-4 rounded-xl border border-gray-700 focus:border-purple-500 outline-none text-lg placeholder-gray-600 transition-colors"
            />
            <input 
              type="date" 
              value={goalDate}
              onChange={(e) => setGoalDate(e.target.value)}
              className="bg-gray-900 text-white p-4 rounded-xl border border-gray-700 focus:border-purple-500 outline-none"
            />
            <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-purple-900/20">
              Set Goal
            </button>
          </form>

          {/* Goal List */}
          <div className="space-y-4">
            {goals.length === 0 && (
              <div className="text-center py-10 text-gray-600">
                <Target size={48} className="mx-auto mb-3 opacity-20" />
                <p>No active goals. Set a target to stay disciplined.</p>
              </div>
            )}

            {goals.map((goal) => (
              <div 
                key={goal.id} 
                className={`group flex items-center justify-between p-5 rounded-xl border transition-all duration-300 ${
                  goal.completed 
                    ? 'bg-gray-900/30 border-gray-800 opacity-60' 
                    : 'bg-gray-700/20 border-gray-600 hover:bg-gray-700/30'
                }`}
              >
                <div className="flex items-center gap-5">
                  <button 
                    onClick={() => toggleGoal(goal.id)}
                    className={`transition-colors ${goal.completed ? 'text-green-500' : 'text-gray-500 hover:text-white'}`}
                  >
                    {goal.completed ? <CheckSquare size={28} /> : <Square size={28} />}
                  </button>
                  
                  <div>
                    <p className={`text-xl font-medium ${goal.completed ? 'line-through text-gray-500 decoration-2' : 'text-white'}`}>
                      {goal.text}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Deadline: {goal.deadline}</p>
                  </div>
                </div>

                <button 
                  onClick={() => deleteGoal(goal.id)}
                  className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-red-400/10"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;