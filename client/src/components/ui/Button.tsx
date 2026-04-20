import React from "react";
import { cn } from "@/lib/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = "primary",
  size = "md",
  leftIcon,
  children,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2.5 font-bold transition-all duration-150 select-none disabled:opacity-40 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30";

  const variants = {
    primary: [
      "bg-brand text-bg shadow-lg shadow-brand/10",
      "hover:brightness-110",
      "active:scale-[0.98] active:brightness-95",
    ].join(" "),

    secondary: [
      "bg-transparent text-text-muted border border-border",
      "hover:bg-surface hover:text-text hover:border-border-hover",
      "active:scale-[0.98]",
    ].join(" "),

    ghost: [
      "bg-transparent text-text-muted",
      "hover:bg-surface hover:text-text",
      "active:scale-[0.98]",
    ].join(" "),

    danger: [
      "bg-transparent text-red-500 border border-red-500/20",
      "hover:bg-red-500/8 hover:border-red-500/30",
      "active:scale-[0.98]",
    ].join(" "),
  };

  const sizes = {
    sm: "h-7 px-3 text-[10px] rounded-none",
    md: "h-10 px-6 text-[10px] rounded-none",
    lg: "h-12 px-8 text-[11px] rounded-none",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
    </button>
  );
};
