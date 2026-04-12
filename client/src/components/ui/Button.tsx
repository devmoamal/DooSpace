import React from "react";
import { cn } from "@/lib/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = "primary",
  size = "md",
  ...props
}) => {
  const variants = {
    primary:
      "bg-[#3ecf8e] text-[#052814] hover:bg-[#32b37a] border-t border-[#6ee7b7]/30 shadow-[0_1px_2px_rgba(0,0,0,0.1)] font-semibold antialiased",
    secondary:
      "bg-[#2e2e2e] text-text border border-[#3e3e3e] hover:bg-[#3e3e3e] hover:border-[#4e4e4e] shadow-sm",
    outline: "bg-transparent border border-border text-text hover:bg-surface-lighter hover:border-text/20 shadow-sm",
    ghost: "text-text-muted hover:text-text hover:bg-surface-lighter",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider",
    md: "px-4 py-2 text-sm font-semibold",
    lg: "px-6 py-3 text-base font-bold",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand/40 focus:ring-offset-2 focus:ring-offset-bg",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
};
