import React from "react";
import { cn } from "@/lib/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = "primary",
  size = "md",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-150 select-none disabled:opacity-40 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30";

  const variants = {
    primary: [
      "bg-brand text-bg",
      "hover:brightness-110",
      "active:scale-[0.97] active:brightness-95",
    ].join(" "),

    secondary: [
      "bg-transparent text-text-muted border border-border",
      "hover:bg-surface hover:text-text hover:border-border-hover",
      "active:scale-[0.97]",
    ].join(" "),

    ghost: [
      "bg-transparent text-text-muted",
      "hover:bg-surface hover:text-text",
      "active:scale-[0.97]",
    ].join(" "),

    danger: [
      "bg-transparent text-red-500 border border-red-500/20",
      "hover:bg-red-500/8 hover:border-red-500/30",
      "active:scale-[0.97]",
    ].join(" "),
  };

  const sizes = {
    sm: "h-7 px-2.5 text-[12px] rounded-md",
    md: "h-8 px-3.5 text-[12px] rounded-md",
    lg: "h-9 px-4 text-[13px] rounded-md",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
};
