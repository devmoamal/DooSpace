import React from "react";
import { cn } from "@/lib/cn";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "outline" | "danger" | "brand" | "subtle";
  size?: "xs" | "sm" | "md" | "lg";
}

export const IconButton: React.FC<IconButtonProps> = ({
  className,
  variant = "ghost",
  size = "md",
  ...props
}) => {
  const variants = {
    ghost: "bg-transparent text-text-subtle hover:text-text hover:bg-surface",
    subtle: "bg-surface border border-border text-text-muted hover:border-border-hover hover:text-text",
    outline: "bg-transparent border border-border text-text-muted hover:border-border-hover hover:text-text",
    brand: "bg-brand/10 text-brand border border-brand/20 hover:bg-brand/20",
    danger: "bg-transparent text-text-subtle hover:text-red-500 hover:bg-red-500/10",
  };

  const sizes = {
    xs: "h-6 w-6 p-1",
    sm: "h-7 w-7 p-1.5",
    md: "h-8 w-8 p-2",
    lg: "h-9 w-9 p-2.5",
  };

  return (
    <button
      className={cn(
        "flex items-center justify-center rounded-none transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
};
