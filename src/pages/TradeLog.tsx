import React, { useState, useRef } from "react";
import { useTrades } from "../store";
import { Trash2, Download, Image as ImageIcon, UploadCloud, X } from "lucide-react";

const TradeLog = () => {
  const { trades, addTrade, deleteTrade, exportToCSV } = useTrades();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for the Image Modal
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    pair: "",
    direction: "Long",
    strategy: "",
    lotSize: "",
    entry: "",
    exitPrice: "",
    pnl: "",
    screenshot: "" as string | null
  });

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, screenshot: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pnlValue = Number(formData.pnl);
    let status: "Win" | "Loss" | "BE" = "BE";
    if (pnlValue > 0) status = "Win";
    if (pnlValue < 0) status = "Loss";

    addTrade({
      id: crypto.randomUUID(),
      ...formData,
      direction: formData.direction as "Long" | "Short",
      entry: Number(formData.entry),
      exitPrice: Number(formData.exitPrice),
      lotSize: Number(formData.lotSize),
      pnl: pnlValue,
      status: status,
      screenshot: formData.screenshot || undefined
    });

    setFormData({
      ...formData, 
      pair: "", entry: "", exitPrice: "", pnl: "", screenshot: null 
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6 relative">
      
      {/* --- IMAGE MODAL (POPUP) --- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors bg-gray-800 p-2 rounded-full"
            >
              <X size={24} />
            </button>
            <img 
              src={selectedImage} 
              alt="Trade Screenshot" 
              className="rounded-lg shadow-2xl border border-gray-700 max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Trade Journal</h1>
        <button onClick={() => exportToCSV('all')} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* INPUT FORM */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <input type="date" required className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 outline-none"
            value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          
          <input type="text" placeholder="PAIR (e.g. XAUUSD)" required className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 uppercase outline-none"
            value={formData.pair} onChange={e => setFormData({...formData, pair: e.target.value})} />

          <select className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 outline-none"
            value={formData.direction} onChange={e => setFormData({...formData, direction: e.target.value})}>
            <option value="Long">Long 🟢</option>
            <option value="Short">Short 🔴</option>
          </select>

          <input type="text" placeholder="Strategy" className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 outline-none"
            value={formData.strategy} onChange={e => setFormData({...formData, strategy: e.target.value})} />

          <input type="number" step="0.01" placeholder="Lot Size" className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 outline-none"
            value={formData.lotSize} onChange={e => setFormData({...formData, lotSize: e.target.value})} />

          <input type="number" step="0.00001" placeholder="Entry Price" className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 outline-none"
            value={formData.entry} onChange={e => setFormData({...formData, entry: e.target.value})} />
          
          <input type="number" step="0.00001" placeholder="Exit Price" className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 outline-none"
            value={formData.exitPrice} onChange={e => setFormData({...formData, exitPrice: e.target.value})} />

          {/* P&L ENTRY WITH DYNAMIC FONT COLOR */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400 font-bold">$</span>
            <input 
              type="number" 
              step="0.01" 
              placeholder="P&L" 
              required 
              className={`w-full bg-gray-700 p-3 pl-8 rounded-lg border border-gray-600 font-bold outline-none transition-colors 
                ${Number(formData.pnl) > 0 ? 'text-green-400' : Number(formData.pnl) < 0 ? 'text-red-400' : 'text-white'}`}
              value={formData.pnl} 
              onChange={e => setFormData({...formData, pnl: e.target.value})} 
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2 bg-gray-700/50 p-2 rounded-lg border border-gray-600 border-dashed">
            <UploadCloud className="text-gray-400 ml-2" size={20} />
            <input 
              type="file" 
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
            />
          </div>

          <button type="submit" className="bg-green-600 hover:bg-green-500 text-white p-3 rounded-lg font-bold transition-colors shadow-lg">
            Add To Journal
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-gray-700/50 text-xs uppercase font-medium text-gray-400">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Pair</th>
                <th className="px-6 py-4">Strategy</th>
                <th className="px-6 py-4">Lot</th>
                <th className="px-6 py-4">P&L</th>
                <th className="px-6 py-4 text-center">Screenshot</th>
                <th className="px-6 py-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {trades.map((trade) => (
                <tr key={trade.id} className="hover:bg-gray-700/30">
                  <td className="px-6 py-4 text-sm">{trade.date}</td>
                  <td className="px-6 py-4 font-bold text-white uppercase">{trade.pair} <span className={`text-[10px] ml-1 ${trade.direction === 'Long' ? 'text-green-400' : 'text-red-400'}`}>{trade.direction}</span></td>
                  <td className="px-6 py-4 text-sm opacity-70">{trade.strategy || "-"}</td>
                  <td className="px-6 py-4 font-mono">{trade.lotSize}</td>
                  <td className={`px-6 py-4 font-bold font-mono ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.pnl >= 0 ? '+' : ''}{trade.pnl}
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    {trade.screenshot ? (
                      <button 
                        onClick={() => setSelectedImage(trade.screenshot || null)}
                        className="text-blue-400 hover:text-white p-2 bg-blue-500/10 rounded-lg transition-all"
                        title="View Screenshot"
                      >
                        <ImageIcon size={20} />
                      </button>
                    ) : <span className="text-gray-600">-</span>}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteTrade(trade.id)} className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {trades.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
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
