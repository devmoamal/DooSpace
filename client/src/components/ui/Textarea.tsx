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
        <textarea
          className={cn(
            "w-full px-3 py-2 bg-surface border border-border rounded text-[13px] text-text outline-none transition-colors placeholder:text-text-subtle font-mono min-h-[100px] resize-none",
            "focus:border-border-hover focus:bg-bg",
            error && "border-red-500/50 focus:border-red-500",
            className,
          )}
          {...props}
        />
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
