import React from "react";
import { cn } from "@/lib/cn";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

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
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div
      className={cn(
        "bg-surface/50 border border-border p-6 rounded-lg transition-all duration-200 group hover:border-brand/40 hover:bg-surface",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-brand/10 text-brand rounded-md border border-brand/20">
          {icon}
        </div>
        {trend !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border",
              isPositive
                ? "bg-brand/10 text-brand border-brand/20"
                : isNegative
                  ? "bg-red-500/10 text-red-500 border-red-500/20"
                  : "bg-text/5 text-text/50 border-border",
            )}
          >
            {isPositive ? (
              <ArrowUpRight size={12} />
            ) : isNegative ? (
              <ArrowDownRight size={12} />
            ) : (
              <Minus size={12} />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
          {label}
        </h4>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-text tracking-tight">
            {value}
          </span>
          {Doo && (
            <span className="text-[11px] font-medium text-text-muted">
              {Doo}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
