import { Search, ChevronRight, Database } from "lucide-react";
import { cn } from "@/lib/cn";
import { DooAvatar } from "@/components/ui/DooAvatar";
import { type DooBoxUsage } from "@doospace/shared";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

interface StudioSidebarProps {
  usage: DooBoxUsage[];
  selectedDooId: number | null;
  onSelect: (doo: DooBoxUsage) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export function StudioSidebar({
  usage,
  selectedDooId,
  onSelect,
  searchTerm,
  onSearchChange,
}: StudioSidebarProps) {
  const filtered = usage.filter(
    (u) =>
      u.dooName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.dooId.toString().includes(searchTerm),
  );

  const totalBytes = usage.reduce((acc, u) => acc + u.sizeBytes, 0);
  const totalDisplay =
    totalBytes > 1024
      ? `${(totalBytes / 1024).toFixed(1)} KB`
      : `${totalBytes} B`;

  return (
    <div className="w-60 border-r border-border bg-bg flex flex-col shrink-0">
      {/* Search */}
      <div className="h-11 border-b border-border flex items-center px-4 shrink-0 bg-surface/30">
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter..."
          className="h-7.5"
          leftIcon={<Search size={12} />}
          onClear={searchTerm ? () => onSearchChange("") : undefined}
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 no-scrollbar">
        {filtered.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center opacity-30">
            <Database size={16} className="mb-2" />
            <p className="text-[10px] font-bold text-center px-4">
              No results found
            </p>
          </div>
        )}
        {filtered.map((doo) => {
          const isActive = selectedDooId === doo.dooId;
          return (
            <button
              key={doo.dooId}
              onClick={() => onSelect(doo)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-none text-left transition-all cursor-pointer group relative",
                isActive
                  ? "bg-surface text-brand shadow-sm"
                  : "text-text-muted hover:bg-surface/50 hover:text-text-subtle",
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-brand rounded-none" />
              )}
              <div className="shrink-0 grayscale-[0.5] group-hover:grayscale-0 transition-all">
                <DooAvatar id={doo.dooId} size={18} className="rounded-none" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold truncate leading-tight group-hover:text-text transition-colors">
                  {doo.dooName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="neutral"
                    size="xs"
                    className="font-mono text-[9px] px-1 h-3.5 opacity-60 font-bold"
                  >
                    {doo.keyCount}
                  </Badge>
                  <span className="text-[9px] font-mono text-text-subtle/50 tabular-nums">
                    {doo.formattedSize}
                  </span>
                </div>
              </div>
              {isActive && (
                <ChevronRight
                  size={12}
                  className="text-brand/40 animate-in slide-in-from-left-1"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="h-10 border-t border-border px-4 flex items-center justify-between shrink-0">
        <span className="text-[10px] text-text-subtle">
          Total
        </span>
        <span className="text-[11px] font-mono text-text-muted">
          {totalDisplay}
        </span>
      </div>
    </div>
  );
}
