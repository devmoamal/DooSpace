import React, { useMemo } from "react";
import { cn } from "@/lib/cn";
import { generateDooAvatar } from "@/utils/doopix";

interface DooAvatarProps {
  id: number | undefined;
  size?: number;
  className?: string;
}

const COLOR_MAP: Record<string, string> = {
  sage: "bg-brand",
  "sage-muted": "bg-brand/30",
  transparent: "bg-transparent",
};

export const DooAvatar: React.FC<DooAvatarProps> = ({
  id,
  size = 40,
  className,
}) => {
  const matrix = useMemo(() => generateDooAvatar(id ?? 0), [id]);

  return (
    <div
      className={cn("relative bg-transparent p-1", className)}
      style={{
        width: size,
        height: size,
      }}
    >
      <div className="flex flex-wrap w-full h-full">
        {matrix.flat().map((color: string, i: number) => {
          const row = Math.floor(i / 5);
          const isEvenRow = row % 2 === 1;

          return (
            <div
              key={i}
              className={cn(
                "transition-colors duration-500 shrink-0",
                COLOR_MAP[color],
              )}
              style={{
                width: "18%",
                height: "25%",
                marginTop: row > 0 ? "-3%" : "0.3%",
                marginLeft: "1%",
                marginRight: "1%",
                transform: isEvenRow ? "translateX(50%)" : "none",
                clipPath:
                  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
