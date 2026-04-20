import React from "react";
import { cn } from "@/lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  labelRight?: React.ReactNode;
  leftIcon?: React.ReactNode;
  horizontal?: boolean;
  onClear?: () => void;
}

import { X } from "lucide-react";

export const Input: React.FC<InputProps> = ({
  className,
  label,
  error,
  helperText,
  labelRight,
  leftIcon,
  horizontal = false,
  onClear,
  value,
  ...props
}) => {
  const containerClasses = horizontal
    ? "grid grid-cols-[1fr_2fr] gap-6 items-start py-3 first:pt-0"
    : "flex flex-col gap-1.5 w-full";

  return (
    <div className={containerClasses}>
      {label && (
        <div className="flex items-center justify-between">
          <label className={cn(
            "text-[12px] font-medium text-text-muted",
            horizontal && "mt-2"
          )}>
            {label}
          </label>
          {labelRight && <div className="text-[11px]">{labelRight}</div>}
        </div>
      )}
      <div className="flex flex-col gap-1.5 w-full">
        <div className="relative flex items-center group">
          {leftIcon && (
            <div className="absolute left-3 text-text-subtle pointer-events-none group-focus-within:text-brand transition-colors">
              {leftIcon}
            </div>
          )}
          <input
            className={cn(
              "w-full px-3 py-2 bg-surface border border-border rounded-none text-[13px] text-text outline-none transition-colors placeholder:text-text-subtle font-mono h-10",
              "focus:border-border-hover focus:bg-bg",
              leftIcon && "pl-8",
              onClear && value && "pr-8",
              error && "border-red-500/50 focus:border-red-500",
              className,
            )}
            value={value}
            {...props}
          />
          {onClear && value && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 p-1 rounded-none hover:bg-surface text-text-subtle hover:text-text transition-colors"
            >
              <X size={12} />
            </button>
          )}
        </div>
        {(helperText || error) && (
          <div className="space-y-0.5">
            {helperText && (
              <p className="text-[11px] text-text-subtle">{helperText}</p>
            )}
            {error && (
              <p className="text-[11px] text-red-500">{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
