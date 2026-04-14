import { Link } from "@tanstack/react-router";
import { type Doo } from "@doospace/shared";
import { DooAvatar } from "@/components/ui/DooAvatar";
import { cn } from "@/lib/cn";
import { Terminal } from "lucide-react";

interface DooCardProps { doo: Doo; }

export function DooCard({ doo }: DooCardProps) {
  return (
    <div
      className={cn(
        "group block border border-border bg-bg hover:bg-surface rounded-md p-4 transition-colors relative",
        !doo.is_active && "opacity-40",
      )}
    >
      <Link
        to="/doo/$id"
        params={{ id: String(doo.id) }}
        className="absolute inset-0 z-10 group-hover:block"
        title={`View ${doo.name}`}
      />
      <div className="flex items-center gap-3">
        <DooAvatar id={doo.id} size={32} className="rounded shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-medium text-text truncate">{doo.name}</h3>
          <p className="text-[11px] text-text-muted truncate mt-0.5">{doo.description || "—"}</p>
        </div>
        
        <Link
          to="/doo/$id/playground"
          params={{ id: String(doo.id) }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="relative z-30 opacity-0 group-hover:opacity-100 p-1.5 rounded text-text-subtle hover:text-brand hover:bg-surface transition-all shrink-0"
          title="Playground"
        >
          <Terminal size={13} className="ml-0.5" />
        </Link>
      </div>
    </div>
  );
}
