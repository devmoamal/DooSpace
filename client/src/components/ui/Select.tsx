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
    ? "grid grid-cols-[1fr_2fr] gap-8 items-start py-4 first:pt-0" 
    : "flex flex-col gap-1.5 w-full";

  return (
    <div className={containerClasses}>
      {label && (
        <label className={cn(
          "text-sm font-medium text-text mt-2.5",
          horizontal && "mt-3"
        )}>
          {label}
        </label>
      )}
      <div className="flex flex-col gap-2 w-full">
        <div className="relative group">
          <select
            className={cn(
              "w-full px-4 py-2.5 bg-[#141414] border border-[#2e2e2e] focus:border-brand/50 transition-all duration-200 text-sm font-normal outline-none rounded-lg placeholder:text-text-muted/30 shadow-sm appearance-none cursor-pointer",
              error && "border-red-500/50 focus:border-red-500/60",
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted/60">
            <ChevronDown size={16} />
          </div>
        </div>
        {(helperText || error) && (
          <div className="flex flex-col gap-1.5 px-0.5">
            {helperText && (
              <p className="text-xs text-text-muted leading-relaxed">
                {helperText}
              </p>
            )}
            {error && (
              <p className="text-xs font-medium text-red-400 animate-in fade-in slide-in-from-top-1">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
