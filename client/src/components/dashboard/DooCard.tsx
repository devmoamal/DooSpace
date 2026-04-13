import { Link } from "@tanstack/react-router";
import { type Doo } from "@doospace/shared";
import { DooAvatar } from "@/components/ui/DooAvatar";
import { cn } from "@/lib/cn";

interface DooCardProps {
  doo: Doo;
}

export function DooCard({ doo }: DooCardProps) {
  const isActive = doo.is_active;

  return (
    <Link
      to="/doo/$id"
      params={{ id: String(doo.id) }}
      className="group block border border-border bg-bg hover:bg-surface rounded-md p-4 transition-colors"
    >
      <div className="flex items-center gap-4">
        <DooAvatar id={doo.id} size={36} className="rounded shrink-0" />

        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-medium text-text truncate">{doo.name}</h3>
          <p className="text-[11px] text-text-muted truncate mt-0.5">
            {doo.description || "—"}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              isActive ? "bg-brand" : "bg-text-subtle"
            )}
          />
          <span className="text-[10px] font-mono text-text-subtle">
            {isActive ? "active" : "off"}
          </span>
        </div>
      </div>
    </Link>
  );
}
