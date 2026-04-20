import React from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "neutral" | "brand";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "xs" | "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  size = "sm",
  children,
  ...props
}) => {
  const variants = {
    default: "bg-surface border-border text-text-muted",
    brand: "bg-brand/10 border-brand/20 text-brand",
    success: "bg-green-500/10 border-green-500/20 text-green-500",
    warning: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    danger: "bg-red-500/10 border-red-500/20 text-red-500",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-500",
    neutral: "bg-surface-lighter border-border text-text-subtle",
  };

  const sizes = {
    xs: "px-1 py-0 text-[8px]",
    sm: "px-1.5 py-0.5 text-[9px]",
    md: "px-2 py-1 text-[11px]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-bold border rounded-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
