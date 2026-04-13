import React from "react";
import { cn } from "@/lib/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-bg transition-colors",
        className
      )}
      {...props}
    />
  );
};
