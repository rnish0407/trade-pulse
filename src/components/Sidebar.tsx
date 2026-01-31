import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PieChart,
  ScrollText,
  Newspaper,
  Settings,
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <AnalysisIcon size={20} />, label: 'Analysis', path: '/analysis' },
    { icon: <ScrollText size={20} />, label: 'Trade Log', path: '/trade-log' },
    { icon: <Newspaper size={20} />, label: 'News', path: '/news' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  // Helper for the icon since PieChart is used above
  function AnalysisIcon({ size }: { size: number }) {
    return <PieChart size={size} />;
  }

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col hidden md:flex">
      <div className="p-6">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight">
          TradePulse
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-100'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="bg-gray-700/30 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Status</p>
          <p className="text-sm font-bold text-green-400">● Active</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
