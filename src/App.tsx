import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // Using HashRouter for GitHub Pages
import { TradeProvider } from './store';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import TradeLog from './pages/TradeLog';
import News from './pages/News';
import Settings from './pages/Settings';

function App() {
  return (
    <TradeProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-900 text-gray-100 font-sans">
          <Sidebar />
          <main className="flex-1 p-8 overflow-y-auto h-screen relative">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/trade-log" element={<TradeLog />} />
              <Route path="/news" element={<News />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </TradeProvider>
  );
}

export default App;