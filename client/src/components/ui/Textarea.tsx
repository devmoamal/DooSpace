import React from "react";
import { cn } from "@/lib/cn";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  horizontal?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  className,
  label,
  error,
  helperText,
  horizontal = false,
  ...props
}) => {
  const containerClasses = horizontal 
    ? "grid grid-cols-[1fr_2fr] gap-8 items-start py-6 first:pt-0" 
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
          <textarea
            className={cn(
              "w-full px-4 py-2 bg-bg border border-border focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all duration-200 text-sm font-normal outline-none rounded-md placeholder:text-text-muted/40 shadow-sm min-h-[120px] resize-none",
              error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
              className,
            )}
            {...props}
          />
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
