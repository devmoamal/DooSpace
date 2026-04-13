import React from "react";
import { cn } from "@/lib/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
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
      "bg-brand text-white hover:bg-brand/90 active:bg-brand/80 font-medium",
    secondary:
      "bg-surface text-text border border-border hover:bg-surface-lighter transition-colors font-medium",
    outline:
      "bg-transparent border border-border text-text-muted hover:bg-surface hover:text-text transition-colors",
    ghost:
      "bg-transparent text-text-muted hover:text-text hover:bg-surface transition-colors",
    danger:
      "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors font-medium",
  };

  const sizes = {
    sm: "px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider rounded",
    md: "px-4 py-2 text-[13px] rounded",
    lg: "px-5 py-2.5 text-[14px] rounded",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
};
