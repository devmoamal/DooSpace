import React from "react";
import { cn } from "@/lib/cn";

interface StatsCardProps {
  label: string;
  value: string | number;
  trend?: number;
  Doo?: string;
  className?: string;
  icon?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  trend,
  Doo,
  className,
  icon,
}) => {
  const isPositive = trend !== undefined && trend > 0;
  const isNeutral = trend !== undefined && trend === 0;

  return (
    <div className={cn(
      "border border-border p-5 bg-surface/30 transition-all hover:bg-surface hover:border-brand/30 group shadow-sm",
      className,
    )}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-bold text-text-muted">
          {label}
        </p>
        {icon && <div className="text-text-subtle">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-[26px] font-bold text-text tracking-tight tabular-nums font-mono">
          {value}
        </span>
        {Doo && (
          <span className="text-[11px] text-text-subtle font-medium">{Doo}</span>
        )}
      </div>
      {trend !== undefined && (
        <p className={cn(
          "text-[11px] font-mono",
          isNeutral ? "text-text-subtle" : isPositive ? "text-brand" : "text-red-500"
        )}>
          {isPositive && "+"}{trend}%
        </p>
      )}
    </div>
  );
};
