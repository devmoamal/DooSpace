import React from "react";
import { cn } from "@/lib/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, glass, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-all duration-300",
        className
      )}
      {...props}
    />
  );
};
