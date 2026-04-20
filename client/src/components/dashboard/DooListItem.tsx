import { Link } from "@tanstack/react-router";
import { type Doo } from "@doospace/shared";
import { DooAvatar } from "@/components/ui/DooAvatar";
import { DooActionStrip } from "./DooActionStrip";
import { cn } from "@/lib/cn";

interface DooListItemProps {
  doo: Doo;
  view?: "grid" | "list";
}

export function DooListItem({ doo, view = "grid" }: DooListItemProps) {
  return (
    <div
      className={cn(
        "group flex relative border border-border rounded-none bg-bg transition-all hover:bg-surface",
        view === "grid" ? "flex-col p-4" : "flex-row items-center p-3 gap-4",
        !doo.is_active && "opacity-40",
      )}
    >
      <Link to="/doo/$id" params={{ id: String(doo.id) }} className="absolute inset-0 z-10">
        <span className="sr-only">View {doo.name}</span>
      </Link>

      {view === "grid" ? (
        <>
          <div className="flex items-start justify-between mb-3">
            <DooAvatar id={doo.id} size={32} className="rounded" />
            <DooActionStrip doo={doo} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex-1">
            <h3 className="text-[13px] font-medium text-text line-clamp-1 mb-0.5">{doo.name}</h3>
            <p className="text-[11px] text-text-muted line-clamp-2 leading-snug">{doo.description || "—"}</p>
          </div>
        </>
      ) : (
        <>
          <div className="relative z-0 shrink-0">
            <DooAvatar id={doo.id} size={28} className="rounded" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[13px] font-medium text-text truncate">{doo.name}</h3>
            <p className="text-[11px] text-text-muted truncate">{doo.description || "—"}</p>
          </div>
          <DooActionStrip doo={doo} className="shrink-0" />
        </>
      )}
    </div>
  );
}
