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
}) => {
  const isPositive = trend !== undefined && trend > 0;
  const isNeutral = trend !== undefined && trend === 0;

  return (
    <div className={cn(
      "border border-border rounded-md p-5 bg-bg transition-colors hover:bg-surface group",
      className,
    )}>
      <p className="text-[10px] font-medium text-text-subtle uppercase tracking-widest mb-3">
        {label}
      </p>
      <div className="flex items-end gap-2 mb-2">
        <span className="text-[22px] font-semibold text-text tracking-tight tabular-nums">
          {value}
        </span>
        {Doo && (
          <span className="text-[11px] text-text-muted">{Doo}</span>
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
