// src/pages/TradeLog.tsx
import React, { useState } from "react";
import { useTrades } from "../store";
import { Plus, Trash2, Download, Image as ImageIcon, ExternalLink } from "lucide-react";

const TradeLog = () => {
  const { trades, addTrade, deleteTrade, exportToCSV } = useTrades();
  
  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    pair: "",
    direction: "Long",
    entry: "",
    stopLoss: "",
    takeProfit: "",
    exitPrice: "",
    status: "Win",
    strategy: "",       // New
    lotSize: "",        // New
    screenshotUrl: "",  // New
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate PnL roughly for display (Entry - Exit) * Lot logic simplified
    const entry = Number(formData.entry);
    const exit = Number(formData.exitPrice);
    const isLong = formData.direction === "Long";
    
    // Simple PnL calc: (Exit - Entry) if Long, (Entry - Exit) if Short
    let pnl = isLong ? (exit - entry) : (entry - exit);
    
    // Multiplier for Lot Size (Assuming standard forex lots for example, 1 lot = $10 per pip)
    // You can adjust this multiplier logic later. For now, we just store the raw number.
    
    addTrade({
      id: crypto.randomUUID(),
      ...formData,
      direction: formData.direction as "Long" | "Short",
      status: formData.status as any,
      entry: Number(formData.entry),
      stopLoss: Number(formData.stopLoss),
      takeProfit: Number(formData.takeProfit),
      exitPrice: Number(formData.exitPrice),
      lotSize: Number(formData.lotSize),
      pnl: parseFloat(pnl.toFixed(2)), // Storing simple PnL
      riskReward: 0, 
      setup: "Manual",
    });

    // Reset Form
    setFormData({ ...formData, pair: "", entry: "", stopLoss: "", takeProfit: "", exitPrice: "", screenshotUrl: "" });
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER WITH EXPORT BUTTONS */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Trade Log</h1>
          <p className="text-gray-400">Record your trades and analyze details.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => exportToCSV('all')}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* INPUT FORM */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Plus className="text-green-400" size={20}/> New Entry
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Row 1: Basics */}
          <input type="date" required className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600"
            value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            
          <input type="text" placeholder="Pair (e.g. EURUSD)" required className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 uppercase"
            value={formData.pair} onChange={e => setFormData({...formData, pair: e.target.value})} />

          <select className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600"
            value={formData.direction} onChange={e => setFormData({...formData, direction: e.target.value})}>
            <option value="Long">Long 🟢</option>
            <option value="Short">Short 🔴</option>
          </select>

          <select className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600"
            value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
            <option value="Win">Win 💰</option>
            <option value="Loss">Loss 💸</option>
            <option value="BE">Break Even ⚖️</option>
          </select>

          {/* Row 2: Strategy & Size */}
          <input type="text" placeholder="Strategy (e.g. Breakout)" className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600"
            value={formData.strategy} onChange={e => setFormData({...formData, strategy: e.target.value})} />

          <input type="number" step="0.01" placeholder="Lot Size" className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600"
            value={formData.lotSize} onChange={e => setFormData({...formData, lotSize: e.target.value})} />

          {/* Row 3: Prices */}
          <input type="number" step="0.00001" placeholder="Entry Price" required className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600"
            value={formData.entry} onChange={e => setFormData({...formData, entry: e.target.value})} />
          
          <input type="number" step="0.00001" placeholder="Exit Price" required className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600"
            value={formData.exitPrice} onChange={e => setFormData({...formData, exitPrice: e.target.value})} />

          {/* Row 4: Screenshot & Submit */}
          <div className="md:col-span-3">
             <input type="text" placeholder="Screenshot Link (Imgur / TradingView URL)" className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600"
            value={formData.screenshotUrl} onChange={e => setFormData({...formData, screenshotUrl: e.target.value})} />
          </div>

          <button type="submit" className="bg-green-600 hover:bg-green-500 text-white p-3 rounded-lg font-bold transition-colors md:col-span-1">
            Add Trade
          </button>
        </form>
      </div>

      {/* TRADE HISTORY TABLE */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-gray-700/50 text-xs uppercase font-medium text-gray-400">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Strategy</th>
                <th className="px-6 py-4">Pair</th>
                <th className="px-6 py-4">Lot</th>
                <th className="px-6 py-4">Result</th>
                <th className="px-6 py-4">P&L</th>
                <th className="px-6 py-4 text-center">Image</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {trades.map((trade) => (
                <tr key={trade.id} className="hover:bg-gray-700/30">
                  <td className="px-6 py-4">{trade.date}</td>
                  <td className="px-6 py-4 text-sm">{trade.strategy || "-"}</td>
                  <td className="px-6 py-4 font-bold">{trade.pair} <span className="text-xs font-normal text-gray-500">({trade.direction})</span></td>
                  <td className="px-6 py-4">{trade.lotSize}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold 
                      ${trade.status === 'Win' ? 'bg-green-500/20 text-green-400' : 
                        trade.status === 'Loss' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {trade.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-bold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${trade.pnl}
                  </td>
                  
                  {/* Screenshot Link */}
                  <td className="px-6 py-4 text-center">
                    {trade.screenshotUrl ? (
                      <a href={trade.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 inline-block">
                        <ImageIcon size={18} />
                      </a>
                    ) : (
                      <span className="text-gray-600">-</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteTrade(trade.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {trades.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No trades logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TradeLog;