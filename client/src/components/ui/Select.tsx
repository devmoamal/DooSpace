import React, { createContext, useContext, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface SelectContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  horizontal?: boolean;
  onValueChange?: (value: string) => void;
  size?: "sm" | "md" | "lg";
}

export const Select: React.FC<SelectProps> = ({
  className,
  label,
  error,
  helperText,
  horizontal = false,
  children,
  onValueChange,
  onChange,
  value,
  size = "md",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerClasses = horizontal
    ? "grid grid-cols-[1fr_2fr] gap-6 items-start py-3 first:pt-0"
    : "flex flex-col gap-1.5 w-full";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e);
    onValueChange?.(e.target.value);
  };

  const sizes = {
    sm: "h-7 px-2 text-[11px]",
    md: "h-10 px-3 text-[13px]",
    lg: "h-12 px-4 text-[14px]",
  };

  // Check if children include SelectTrigger (custom mode)
  const isCustom = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && (child.type === SelectTrigger)
  );

  if (isCustom) {
    return (
      <SelectContext.Provider value={{ value: value as string, onValueChange, isOpen, setIsOpen }}>
        <div className={cn("relative w-full", className)}>
          {children}
        </div>
      </SelectContext.Provider>
    );
  }

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
              "w-full bg-surface border border-border rounded-none text-text outline-none transition-colors appearance-none cursor-pointer",
              "focus:border-border-hover focus:bg-bg",
              sizes[size],
              error && "border-red-500/50",
              className,
            )}
            value={value}
            onChange={handleChange}
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

export const SelectTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const context = useContext(SelectContext);
  return (
    <div 
      onClick={() => context?.setIsOpen(!context?.isOpen)}
      className={cn(
        "flex items-center justify-between w-full bg-surface border border-border px-3 py-2 cursor-pointer hover:bg-surface/80 transition-colors",
        className
      )}
    >
      {children}
      <ChevronDown size={14} className={cn("transition-transform duration-200", context?.isOpen && "rotate-180")} />
    </div>
  );
};

export const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
  const context = useContext(SelectContext);
  
  // Try to find the display label from SelectItems if context.value is set
  // For simplicity since we keep children as options in custom mode mostly, 
  // we just show the value or placeholder.
  return (
    <span className={cn(!context?.value && "text-text-subtle")}>
        {context?.value || placeholder}
    </span>
  );
};

export const SelectContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const context = useContext(SelectContext);
  if (!context?.isOpen) return null;

  return (
    <div className={cn(
      "absolute top-full left-0 right-0 z-50 mt-1 bg-surface border border-border shadow-xl animate-in fade-in slide-in-from-top-2 duration-200",
      className
    )}>
      <div className="max-h-60 overflow-y-auto p-1">
        {children}
      </div>
    </div>
  );
};

export const SelectItem: React.FC<{ value: string; children: React.ReactNode; className?: string }> = ({ value, children, className }) => {
  const context = useContext(SelectContext);
  const isSelected = context?.value === value;

  return (
    <div
      onClick={() => {
        context?.onValueChange?.(value);
        context?.setIsOpen(false);
      }}
      className={cn(
        "px-3 py-2 text-[11px] cursor-pointer transition-colors",
        isSelected ? "bg-brand text-white" : "hover:bg-bg",
        className
      )}
    >
      {children}
    </div>
  );
};
