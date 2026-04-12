import React from "react";
import { cn } from "@/lib/cn";

interface DooPixProps {
  pixels: string[][];
  className?: string;
  size?: number | string;
}

const COLOR_MAP: Record<string, string> = {
  white: "bg-surface",
  brown: "bg-amber-900 shadow-inner",
  yellow: "bg-yellow-400 shadow-inner",
  red: "bg-red-600 shadow-inner",
  green: "bg-emerald-600 shadow-inner",
  blue: "bg-blue-600 shadow-inner",
  purple: "bg-purple-600 shadow-inner",
  brand: "bg-brand shadow-inner",
};

export const DooPix: React.FC<DooPixProps> = ({ pixels, className, size = 160 }) => {
  return (
    <div
      className={cn(
        "relative grid grid-cols-10 gap-0.5 overflow-hidden rounded-xl border border-border bg-bg shadow-sm p-1.5",
        className
      )}
      style={{ width: size, aspectRatio: "10/4" }}
    >
      {pixels.flat().map((color, i) => (
        <div
          key={i}
          className={cn(
            "h-full w-full transition-colors duration-200 rounded-[2px]",
            COLOR_MAP[color] || "bg-border/50"
          )}
        />
      ))}
    </div>
  );
};
