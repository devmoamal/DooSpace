import React, { useMemo } from "react";
import { cn } from "@/lib/cn";
import { generateDooAvatar } from "@/utils/doopix";

interface DooAvatarProps {
  id: number | undefined;
  size?: number;
  className?: string;
}

// brand → full brand color, brand/25 → dimmed, transparent → nothing
const COLOR_MAP: Record<string, string> = {
  "sage":        "#3ecf8e",
  "sage-muted":  "rgba(62,207,142,0.22)",
  "transparent": "transparent",
};

export const DooAvatar: React.FC<DooAvatarProps> = ({ id, size = 40, className }) => {
  const matrix = useMemo(() => generateDooAvatar(id ?? 0), [id]);
  const flat = matrix.flat() as string[];

  // 5 columns × N rows
  const COLS = 5;
  const ROWS = Math.ceil(flat.length / COLS);
  const gap = 1;
  const cellSize = Math.floor((size - gap * (COLS + 1)) / COLS);
  const svgH = ROWS * cellSize + gap * (ROWS + 1);

  return (
    <div
      className={cn("shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${svgH}`}
        shapeRendering="crispEdges"
        style={{ display: "block" }}
      >
        {flat.map((color, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const x = gap + col * (cellSize + gap);
          const y = gap + row * (cellSize + gap);
          const fill = COLOR_MAP[color] ?? "transparent";
          if (!fill || fill === "transparent") return null;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={cellSize}
              height={cellSize}
              fill={fill}
              rx={0}
            />
          );
        })}
      </svg>
    </div>
  );
};
