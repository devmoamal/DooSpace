import { Link } from "@tanstack/react-router";
import { Power, MoreHorizontal, Terminal } from "lucide-react";
import { DooPix } from "@/components/ui/DooPix";
import { Button } from "../ui/Button";

interface DooCardProps {
  doo: any;
}

export function DooCard({ doo }: DooCardProps) {
  return (
    <Link
      to="/doo"
      search={{ id: String(doo.id) }}
      className="group block bg-surface border border-border hover:border-brand/40 rounded-lg p-6 transition-all"
    >
      <div className="flex items-center gap-6">
        <DooPix
          pixels={doo.pixels || Array(4).fill(Array(10).fill("white"))}
          size={120}
          className="shrink-0 group-hover:scale-105 transition-transform duration-300"
        />

        <div className="flex-1 space-y-2.5 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-text truncate">
              {doo.name}
            </h3>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Power size={16} />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal size={16} />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-5 text-sm text-text-muted font-medium">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-brand" />
              <span>{doo.trigger || "Webhook API"}</span>
            </div>
            <div className="flex items-center gap-2 bg-brand/10 px-2 py-0.5 rounded-md text-brand">
              <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider uppercase">
                Active
              </span>
            </div>
            <div className="flex items-center gap-2 ml-auto text-xs opacity-60">
              <span>
                Updated{" "}
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                }).format(new Date(doo.updated_at || Date.now()))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
