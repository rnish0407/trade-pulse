// src/types/index.ts
export type Trade = {
  id: string;
  date: string;
  pair: string;
  direction: "Long" | "Short";
  entry: number;
  exitPrice: number;
  pnl: number;        // Now a manual input field
  status: "Win" | "Loss" | "BE"; // We will calculate this automatically
  strategy: string;
  lotSize: number;
  screenshot?: string; // Stores the image data
};