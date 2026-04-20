import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { useThemeStore } from "@/stores/theme.store";

interface RequestsChartProps {
  data: any[];
  successRate?: number;
  height?: number;
}

export const RequestsChart: React.FC<RequestsChartProps> = ({
  data,
  successRate = 100,
  height = 220,
}) => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const colors = {
    brand:       "#3ecf8e",
    grid:        isDark ? "#1f1f1f" : "#efefef",
    tick:        isDark ? "#4e4e4e" : "#b0b0b0",
    tooltipBg:   isDark ? "#161616" : "#ffffff",
    tooltipBorder: isDark ? "#242424" : "#ebebeb",
    tooltipText: isDark ? "#ededed" : "#111111",
  };

  return (
    <div className="border border-border rounded-none p-5 bg-bg">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[12px] font-medium text-text">Traffic</p>
        <span className="text-[11px] font-mono text-brand tabular-nums">
          {successRate}% uptime
        </span>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#3ecf8e" stopOpacity={isDark ? 0.15 : 0.08} />
              <stop offset="100%" stopColor="#3ecf8e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={colors.grid} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: colors.tick, fontSize: 10, fontFamily: "monospace" }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: colors.tick, fontSize: 10, fontFamily: "monospace" }}
          />
          <Tooltip
            cursor={{ stroke: "#3ecf8e", strokeWidth: 1, strokeDasharray: "3 3" }}
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              borderColor:     colors.tooltipBorder,
              border:          `1px solid ${colors.tooltipBorder}`,
              borderRadius:    "4px",
              fontSize:        "11px",
              fontFamily:      "monospace",
              color:           colors.tooltipText,
              boxShadow:       "none",
            }}
            itemStyle={{ color: "#3ecf8e" }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#3ecf8e"
            strokeWidth={1.5}
            fill="url(#areaFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
