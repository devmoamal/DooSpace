import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
// No theme hook needed as it's not defined in the project yet

interface RequestsChartProps {
  data: any[];
  successRate?: number;
  height?: number;
}

export const RequestsChart: React.FC<RequestsChartProps> = ({ data, successRate = 100, height = 300 }) => {
  const colors = {
    brand: "#3ecf8e", // Supabase Emerald
    grid: "rgba(255, 255, 255, 0.05)",
    text: "rgba(255, 255, 255, 0.4)",
    tooltipBg: "#171717",
    tooltipBorder: "#232323",
  };

  return (
    <div style={{ width: "100%", height }} className="bg-surface/50 p-6 rounded-lg border border-border shadow-none overflow-hidden relative group">
      {/* subtle grid background effect */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#3ecf8e_1px,transparent_1px)] bg-size-[16px_16px]" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-text uppercase tracking-widest">Traffic Volume</h3>
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">Operational Throughput</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-brand/5 border border-brand/10 rounded text-[10px] font-bold text-brand uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            {successRate}% Uptime
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="75%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.brand} stopOpacity={0.15} />
              <stop offset="95%" stopColor={colors.brand} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="0" vertical={false} stroke={colors.grid} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: colors.text, fontSize: 10, fontWeight: 700, fontFamily: 'monospace' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: colors.text, fontSize: 10, fontWeight: 700, fontFamily: 'monospace' }} 
          />
          <Tooltip 
            cursor={{ stroke: colors.brand, strokeWidth: 1, strokeDasharray: '4 4' }}
            contentStyle={{ 
              backgroundColor: colors.tooltipBg, 
              borderColor: colors.tooltipBorder,
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#ffffff',
              border: '1px solid #2e2e2e',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
            }}
            itemStyle={{ color: colors.brand, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke={colors.brand}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCount)"
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
