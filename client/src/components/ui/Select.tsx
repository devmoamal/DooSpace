import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  horizontal?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  className,
  label,
  error,
  helperText,
  horizontal = false,
  children,
  ...props
}) => {
  const containerClasses = horizontal
    ? "grid grid-cols-[1fr_2fr] gap-6 items-start py-3 first:pt-0"
    : "flex flex-col gap-1.5 w-full";

  return (
    <div className={containerClasses}>
      {label && (
        <label className={cn(
          "text-[12px] font-medium text-text-muted",
          horizontal && "mt-2"
        )}>
          {label}
        </label>
      )}
      <div className="flex flex-col gap-1.5 w-full">
        <div className="relative">
          <select
            className={cn(
              "w-full px-3 py-2 bg-surface border border-border rounded text-[13px] text-text outline-none transition-colors appearance-none cursor-pointer",
              "focus:border-border-hover focus:bg-bg",
              error && "border-red-500/50",
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-subtle">
            <ChevronDown size={14} />
          </div>
        </div>
        {(helperText || error) && (
          <div className="space-y-0.5">
            {helperText && <p className="text-[11px] text-text-subtle">{helperText}</p>}
            {error && <p className="text-[11px] text-red-500">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};
