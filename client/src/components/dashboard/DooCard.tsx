import { Link } from "@tanstack/react-router";
import { type Doo } from "@doospace/shared";
import { DooAvatar } from "@/components/ui/DooAvatar";
import { cn } from "@/lib/cn";

interface DooCardProps { doo: Doo; }

export function DooCard({ doo }: DooCardProps) {
  return (
    <Link
      to="/doo/$id"
      params={{ id: String(doo.id) }}
      className={cn(
        "group block border border-border bg-bg hover:bg-surface rounded-md p-4 transition-colors",
        !doo.is_active && "opacity-40",
      )}
    >
      <div className="flex items-center gap-3">
        <DooAvatar id={doo.id} size={32} className="rounded shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-medium text-text truncate">{doo.name}</h3>
          <p className="text-[11px] text-text-muted truncate mt-0.5">{doo.description || "—"}</p>
        </div>
      </div>
    </Link>
  );
}
