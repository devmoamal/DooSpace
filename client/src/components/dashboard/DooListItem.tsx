import { Link } from "@tanstack/react-router";
import { type Doo } from "@doospace/shared";
import { DooAvatar } from "@/components/ui/DooAvatar";
import { cn } from "@/lib/cn";
import { DooActionStrip } from "./DooActionStrip";


interface DooListItemProps {
  doo: Doo;
  view?: "grid" | "list";
}

export function DooListItem({ doo, view = "grid" }: DooListItemProps) {
  const isActive = doo.is_active;


  return (
    <div
      className={cn(
        "group flex relative overflow-hidden",
        view === "grid" 
          ? "flex-col bg-surface/40 border border-border/50 hover:border-brand/40 hover:bg-surface/80 rounded-xl p-2 h-full" 
          : "flex-row items-center bg-surface/30 border border-border/40 hover:border-brand/30 hover:bg-surface/60 rounded-lg p-3 gap-4",
        !isActive && "opacity-60 saturate-50",
      )}
    >
      <Link
        to="/doo/$id"
        params={{ id: String(doo.id) }}
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">View Doo</span>
      </Link>

      {view === "grid" ? (
        <>
          {/* Grid Header */}
          <div className="flex items-start justify-between mb-3 relative">
            <DooAvatar id={doo.id} size={42} className="" />
            <DooActionStrip 
              doo={doo} 
              className="opacity-0 group-hover:opacity-100 transition-opacity" 
            />
          </div>

          {/* Grid Body */}
          <div className="flex-1 relative">
            <h3 className="text-sm font-bold text-text group-hover:text-brand transition-colors line-clamp-1 mb-0.5">
              {doo.name}
            </h3>
            <p className="text-[11px] text-text-muted line-clamp-2 leading-snug font-medium">
              {doo.description || "No description ... "}
            </p>
          </div>
        </>
      ) : (
        <>
          {/* List Mode */}
          <div className="relative z-0 shrink-0">
            <DooAvatar id={doo.id} size={40} className="" />
          </div>

          <div className="flex-1 min-w-0 relative">
            <h3 className="text-sm font-bold text-text group-hover:text-brand transition-colors truncate">
              {doo.name}
            </h3>
            <p className="text-[11px] text-text-muted truncate font-medium">
              {doo.description || "No description available ... "}
            </p>
          </div>

          <DooActionStrip doo={doo} />
        </>
      )}
    </div>
  );
}

