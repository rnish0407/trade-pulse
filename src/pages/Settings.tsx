import React, { useState } from 'react';
import { useTrades } from '../store';
import { User, Save, Quote } from 'lucide-react';

const Settings = () => {
  const { userProfile, updateProfile } = useTrades();
  const [name, setName] = useState(userProfile.name);

  const handleSave = () => {
    updateProfile(name);
    alert("Profile Updated!");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white">Settings</h1>

      {/* User Name Section */}
      <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <User className="text-blue-400" /> User Profile
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Display Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-900 text-white p-4 rounded-xl border border-gray-700 focus:border-blue-500 outline-none transition-all text-lg"
              placeholder="Enter your name"
            />
          </div>
          
          <button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Save size={20} /> Save Changes
          </button>
        </div>
      </div>

      {/* The Quote Section */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-gray-900 p-10 rounded-2xl border border-gray-800 text-center">
          <Quote className="text-gray-600 mx-auto mb-4 opacity-50" size={40} />
          <blockquote className="text-2xl font-light text-gray-300 italic tracking-wide font-serif">
            "Learn and groww"
          </blockquote>
          <div className="mt-6 flex justify-center items-center gap-3">
            <div className="h-px w-12 bg-gray-700"></div>
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 uppercase tracking-widest">
              Nishant Rajput
            </span>
            <div className="h-px w-12 bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;