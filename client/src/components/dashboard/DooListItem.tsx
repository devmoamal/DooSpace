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
    <div className={cn(
      "group flex relative overflow-hidden border border-border rounded-md bg-bg transition-colors hover:bg-surface",
      view === "grid" ? "flex-col p-4" : "flex-row items-center p-3 gap-4",
      !isActive && "opacity-50",
    )}>
      {/* Full-card link */}
      <Link
        to="/doo/$id"
        params={{ id: String(doo.id) }}
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">View {doo.name}</span>
      </Link>

      {view === "grid" ? (
        <>
          <div className="flex items-start justify-between mb-3">
            <DooAvatar id={doo.id} size={34} className="rounded" />
            <DooActionStrip doo={doo} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex-1">
            <h3 className="text-[13px] font-medium text-text line-clamp-1 mb-0.5">
              {doo.name}
            </h3>
            <p className="text-[11px] text-text-muted line-clamp-2 leading-snug">
              {doo.description || "—"}
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
            <span className={cn(
              "w-1.5 h-1.5 rounded-full shrink-0",
              isActive ? "bg-brand" : "bg-text-subtle"
            )} />
            <span className="text-[10px] font-mono text-text-subtle">
              {isActive ? "active" : "inactive"}
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="relative z-0 shrink-0">
            <DooAvatar id={doo.id} size={30} className="rounded" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[13px] font-medium text-text truncate">{doo.name}</h3>
            <p className="text-[11px] text-text-muted truncate">{doo.description || "—"}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              isActive ? "bg-brand" : "bg-text-subtle"
            )} />
            <DooActionStrip doo={doo} />
          </div>
        </>
      )}
    </div>
  );
}
