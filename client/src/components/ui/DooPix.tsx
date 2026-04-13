import React from "react";
import { cn } from "@/lib/cn";

interface DooPixProps {
  pixels: string[][];
  className?: string;
  size?: number | string;
}

const COLOR_MAP: Record<string, string> = {
  white:  "bg-surface",
  brown:  "bg-amber-800",
  yellow: "bg-yellow-400",
  red:    "bg-red-500",
  green:  "bg-emerald-500",
  blue:   "bg-blue-500",
  purple: "bg-purple-500",
  brand:  "bg-brand",
};

export const DooPix: React.FC<DooPixProps> = ({ pixels, className, size = 160 }) => {
  return (
    <div
      className={cn(
        "relative grid grid-cols-10 gap-px overflow-hidden rounded border border-border bg-bg p-1",
        className
      )}
      style={{ width: size, aspectRatio: "10/4" }}
    >
      {pixels.flat().map((color, i) => (
        <div
          key={i}
          className={cn(
            "h-full w-full rounded-[1px]",
            COLOR_MAP[color] || "bg-border"
          )}
        />
      ))}
    </div>
  );
};
