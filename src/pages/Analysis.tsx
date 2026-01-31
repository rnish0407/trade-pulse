import React, { useMemo, useState } from 'react';
import { useTrades } from "../store";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from "lucide-react";

// --- HELPER FUNCTIONS FOR CALENDAR ---
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const Analysis = () => {
  const { trades } = useTrades();
  
  // --- STATE FOR CALENDAR ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // --- 1. PREPARE CALENDAR DATA ---
  const calendarData = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const startDay = getFirstDayOfMonth(year, month);
    
    // Create an array for the grid (empty slots for days before the 1st)
    const days = Array(startDay).fill(null); 
    
    // Fill in actual days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      
      // Find trades for this specific day
      const dayTrades = trades.filter(t => t.date === dateStr);
      const totalPnl = dayTrades.reduce((sum, t) => sum + t.pnl, 0);
      const tradeCount = dayTrades.length;
      
      days.push({ day: i, dateStr, totalPnl, tradeCount });
    }
    return days;
  }, [trades, year, month]);

  // --- 2. PREPARE ASSET & STRATEGY DATA ---
  const { assetData, strategyData, consistencyData } = useMemo(() => {
    const assets: Record<string, number> = {};
    const strategies: Record<string, number> = {};
    
    let wins = 0;
    let total = 0;
    const consistency = []; // Array for winrate over time

    // Sort trades by date for consistency curve
    const sortedTrades = [...trades].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedTrades.forEach(t => {
      // Asset Stats
      if (!assets[t.pair]) assets[t.pair] = 0;
      assets[t.pair] += t.pnl;

      // Strategy Stats
      const strat = t.strategy || "Unknown";
      if (!strategies[strat]) strategies[strat] = 0;
      strategies[strat] += t.pnl;

      // Consistency (Rolling Win Rate)
      total++;
      if (t.pnl > 0) wins++;
      consistency.push({
        trade: total,
        winRate: Math.round((wins / total) * 100)
      });
    });

    // Convert to Arrays for Recharts
    const assetArr = Object.keys(assets).map(k => ({ name: k, pnl: assets[k] })).sort((a,b) => b.pnl - a.pnl);
    const stratArr = Object.keys(strategies).map(k => ({ name: k, pnl: strategies[k] })).sort((a,b) => b.pnl - a.pnl);

    return { assetData: assetArr, strategyData: stratArr, consistencyData: consistency };
  }, [trades]);

  // --- CALENDAR NAVIGATION ---
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="space-y-8 pb-12">
      <h1 className="text-3xl font-bold text-white">Performance Analytics</h1>

      {/* --- SECTION 1: CALENDAR HEATMAP --- */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <CalIcon className="text-blue-400" />
            <h2 className="text-xl font-semibold text-white">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
          </div>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-700 rounded-lg"><ChevronLeft size={20}/></button>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-700 rounded-lg"><ChevronRight size={20}/></button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-gray-400 text-sm font-medium">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {calendarData.map((day, idx) => {
            if (!day) return <div key={idx} className="h-24 bg-transparent"></div>;
            
            // Determine Color
            let bgClass = "bg-gray-700/30";
            if (day.tradeCount > 0) {
              bgClass = day.totalPnl > 0 ? "bg-green-500/20 border-green-500/50" : day.totalPnl < 0 ? "bg-red-500/20 border-red-500/50" : "bg-gray-600";
            }

            return (
              <div key={idx} className={`h-24 p-2 rounded-lg border border-transparent flex flex-col justify-between transition-all hover:scale-[1.02] ${bgClass}`}>
                <span className="text-gray-400 text-xs">{day.day}</span>
                {day.tradeCount > 0 && (
                  <div className="text-right">
                    <div className={`font-bold text-sm ${day.totalPnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {day.totalPnl > 0 ? '+' : ''}{day.totalPnl}
                    </div>
                    <div className="text-xs text-gray-500">{day.tradeCount} trade{day.tradeCount > 1 ? 's' : ''}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- SECTION 2: CHARTS ROW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Best Assets (Now Vertical) */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-4">Best Performing Pairs</h3>
          <ResponsiveContainer width="100%" height="90%">
            {/* Removed layout="vertical" to make it standard vertical bars */}
            <BarChart data={assetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={(val) => `$${val}`} />
              <Tooltip cursor={{fill: '#374151'}} contentStyle={{backgroundColor: '#1f2937', borderColor: '#4b5563', color: '#fff'}} />
              {/* Added barSize={40} for small-medium width */}
              <Bar dataKey="pnl" name="P&L" barSize={40}>
                {assetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Strategy Performance */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-4">Strategy Performance</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={strategyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={(val) => `$${val}`} />
              <Tooltip cursor={{fill: '#374151'}} contentStyle={{backgroundColor: '#1f2937', borderColor: '#4b5563', color: '#fff'}} />
              {/* Added barSize={40} for small-medium width */}
              <Bar dataKey="pnl" name="P&L" barSize={40}>
                {strategyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#3b82f6' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- SECTION 3: CONSISTENCY CURVE --- */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-[350px]">
        <h3 className="text-lg font-semibold text-white mb-4">Consistency (Rolling Win Rate)</h3>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={consistencyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="trade" label={{ value: 'Trades', position: 'insideBottomRight', offset: -5 }} stroke="#9ca3af" />
            <YAxis domain={[0, 100]} stroke="#9ca3af" unit="%" />
            <Tooltip contentStyle={{backgroundColor: '#1f2937', borderColor: '#4b5563', color: '#fff'}} />
            <Legend />
            <Line type="monotone" dataKey="winRate" stroke="#8b5cf6" strokeWidth={3} dot={false} name="Win Rate %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Analysis;