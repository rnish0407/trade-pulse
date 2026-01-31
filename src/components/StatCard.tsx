// src/components/StatCard.tsx
import React from 'react';
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

export default function StatCard({ title, value, icon: Icon, trend }: Props) {
  const color = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-gray-400";
  
  return (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</h3>
        <div className={`p-2 rounded-lg bg-gray-700/50 ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}