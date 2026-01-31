import React, { useEffect, useState, useRef } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';

// --- COMPONENTS ---

// 1. GENERIC TRADINGVIEW WIDGET HELPER
const TradingViewWidget = ({ scriptSrc, widgetConfig, containerId }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""; // Clear previous render
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify(widgetConfig);
      containerRef.current.appendChild(script);
    }
  }, [scriptSrc, widgetConfig]);

  return (
    <div className="tradingview-widget-container h-full w-full" id={containerId}>
      <div className="tradingview-widget-container__widget h-full w-full" ref={containerRef}></div>
    </div>
  );
};

// 2. CUSTOM YAHOO FINANCE FEED
const YahooFinanceFeed = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchYahooNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://finance.yahoo.com/news/rssindex");
      const data = await res.json();
      if (data.items) setNews(data.items.slice(0, 15));
    } catch (error) {
      console.error("Failed to fetch Yahoo News", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchYahooNews(); }, []);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-gray-700 bg-[#720e9e]/20 flex justify-between items-center shrink-0">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="bg-[#720e9e] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">Y!</span> 
          Yahoo Finance
        </h2>
        <button onClick={fetchYahooNews} className="text-gray-400 hover:text-white transition-colors">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {loading ? (
          <div className="text-center text-gray-500 py-4 text-xs">Loading...</div>
        ) : (
          news.map((item, index) => (
            <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="block group border-b border-gray-700 pb-2 last:border-0">
              <h3 className="text-xs font-medium text-gray-300 group-hover:text-purple-400 leading-snug mb-1 transition-colors">{item.title}</h3>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-500">{new Date(item.pubDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
};

// --- MAIN LAYOUT ---

const News = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-3">
      
      {/* 1. TICKER TAPE (Top) */}
      <div className="h-12 shrink-0 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-sm">
        <TradingViewWidget 
          containerId="ticker-tape"
          scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js"
          widgetConfig={{
            "symbols": [
              { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500" },
              { "proName": "FOREXCOM:NSXUSD", "title": "Nasdaq" },
              { "proName": "FX_IDC:EURUSD", "title": "EUR/USD" },
              { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
              { "proName": "FX_IDC:XAUUSD", "title": "Gold" }
            ],
            "showSymbolLogo": true, "isTransparent": true, "displayMode": "adaptive", "colorTheme": "dark", "locale": "en"
          }}
        />
      </div>

      {/* 2. THE QUADRANT GRID (2x2) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 grid-rows-2 gap-3 min-h-0">
        
        {/* TOP LEFT: YAHOO NEWS */}
        <YahooFinanceFeed />

        {/* TOP RIGHT: TRADINGVIEW NEWS TIMELINE */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-gray-700 bg-blue-900/20 shrink-0">
             <h2 className="text-sm font-bold text-white">📰 Breaking Headlines (TV)</h2>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0">
              <TradingViewWidget 
                containerId="timeline-widget"
                scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"
                widgetConfig={{
                  "feedMode": "all_symbols", "colorTheme": "dark", "isTransparent": true, "displayMode": "regular", "width": "100%", "height": "100%", "locale": "en"
                }}
              />
            </div>
          </div>
        </div>

        {/* BOTTOM LEFT: ECONOMIC CALENDAR */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-gray-700 bg-green-900/20 shrink-0">
             <h2 className="text-sm font-bold text-white">📅 Economic Calendar</h2>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0">
              <TradingViewWidget 
                containerId="calendar-widget"
                scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-events.js"
                widgetConfig={{
                  "colorTheme": "dark", "isTransparent": true, "width": "100%", "height": "100%", "locale": "en", "importanceFilter": "-1,0,1"
                }}
              />
            </div>
          </div>
        </div>

        {/* BOTTOM RIGHT: ADVANCED CHART (Fixed & Changeable) */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col">
          {/* Header removed to give full space to chart tools */}
          <div className="flex-1 relative">
            <div className="absolute inset-0">
              <TradingViewWidget 
                containerId="advanced-chart-widget"
                scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
                widgetConfig={{
                  "autosize": true,
                  "symbol": "FX:XAUUSD", // Default Symbol (Gold)
                  "interval": "D",
                  "timezone": "Etc/UTC",
                  "theme": "dark",
                  "style": "1",
                  "locale": "en",
                  "enable_publishing": false,
                  "allow_symbol_change": true, // THIS ENABLED SEARCH
                  "calendar": false,
                  "support_host": "https://www.tradingview.com"
                }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default News;