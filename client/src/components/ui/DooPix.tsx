import React, { useMemo, useState } from "react";
import { cn } from "@/lib/cn";

const PALETTE: Record<string, string> = {
  brand: "#3ecf8e",
  log: "#eab308",
  error: "#ef4444",
  db: "#f59e0b",
  fetch: "#3b82f6",
  purple: "#a855f7",
};

const LABELS: Record<string, string> = {
  brand: "callDoo",
  log: "log",
  error: "error",
  db: "db",
  fetch: "fetch",
  purple: "chain",
};

function resolveColor(c: string): string | null {
  if (!c) return null;
  if (PALETTE[c]) return PALETTE[c];
  if (c.startsWith("#") || c.startsWith("rgb")) return c;
  return null;
}

interface DooPixProps {
  pixels: string[] | string[][] | null | undefined;
  className?: string;
  pixelSize?: number;
  maxCols?: number;
}

export const DooPix: React.FC<DooPixProps> = ({
  pixels,
  className,
  pixelSize = 8,
  maxCols = 16,
}) => {
  const [hovered, setHovered] = useState<{
    x: number;
    y: number;
    label: string;
  } | null>(null);

  const flat = useMemo((): string[] => {
    if (!pixels || !Array.isArray(pixels)) return [];
    if (pixels.length === 0) return [];
    if (Array.isArray(pixels[0])) return (pixels as string[][]).flat();
    return pixels as string[];
  }, [pixels]);

  const events = useMemo(
    () => flat.filter((c) => resolveColor(c) !== null),
    [flat],
  );

  if (events.length === 0) return null;

  const cols = Math.min(events.length, maxCols);
  const rows = Math.ceil(events.length / cols);
  const gap = 2;
  const w = cols * pixelSize + (cols - 1) * gap;
  const h = rows * pixelSize + (rows - 1) * gap;

  return (
    <div
      className={cn("relative shrink-0 select-none", className)}
      style={{ width: w }}
    >
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        shapeRendering="crispEdges"
        style={{ display: "block" }}
        onMouseLeave={() => setHovered(null)}
      >
        {events.map((color, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = col * (pixelSize + gap);
          const y = row * (pixelSize + gap);
          const fill = resolveColor(color)!;
          const label = LABELS[color] ?? color;

          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={pixelSize}
              height={pixelSize}
              fill={fill}
              opacity={hovered && hovered.label !== label ? 0.3 : 1}
              onMouseEnter={() =>
                setHovered({ x: x + pixelSize / 2, y, label })
              }
              style={{ transition: "opacity 80ms" }}
            />
          );
        })}
      </svg>

      {/* Floating label tooltip */}
      {hovered && (
        <div
          className="absolute pointer-events-none z-50"
          style={{
            left: hovered.x,
            top: hovered.y - 24,
            transform: "translateX(-50%)",
          }}
        >
          <span
            className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold whitespace-nowrap"
            style={{
              background: resolveColor(hovered.label) ?? "#555",
              color: "#000",
            }}
          >
            {hovered.label}
          </span>
        </div>
      )}
    </div>
  );
};
