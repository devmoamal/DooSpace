import { Search, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { DooAvatar } from "@/components/ui/DooAvatar";
import { type DooBoxUsage } from "@doospace/shared";

interface StudioSidebarProps {
  usage: DooBoxUsage[];
  selectedDooId: number | null;
  onSelect: (doo: DooBoxUsage) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export function StudioSidebar({
  usage, selectedDooId, onSelect, searchTerm, onSearchChange,
}: StudioSidebarProps) {
  const filtered = usage.filter((u) =>
    u.dooName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.dooId.toString().includes(searchTerm)
  );

  const totalBytes = usage.reduce((acc, u) => acc + u.sizeBytes, 0);
  const totalDisplay = totalBytes > 1024
    ? `${(totalBytes / 1024).toFixed(1)} KB`
    : `${totalBytes} B`;

  return (
    <div className="w-60 border-r border-border bg-bg flex flex-col shrink-0">
      {/* Search */}
      <div className="h-11 border-b border-border flex items-center px-3 shrink-0">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-subtle" size={13} />
          <input
            className="w-full h-7 pl-8 pr-3 bg-surface border border-border rounded text-[12px] text-text placeholder:text-text-subtle outline-none focus:border-border-hover transition-colors"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 no-scrollbar">
        {filtered.length === 0 && (
          <p className="text-[11px] text-text-subtle px-3 py-4 text-center">No results</p>
        )}
        {filtered.map((doo) => {
          const isActive = selectedDooId === doo.dooId;
          return (
            <button
              key={doo.dooId}
              onClick={() => onSelect(doo)}
              className={cn(
                "w-full flex items-center gap-2.5 px-2 py-2 rounded text-left transition-colors cursor-pointer",
                isActive
                  ? "bg-surface text-text"
                  : "text-text-muted hover:bg-surface hover:text-text",
              )}
            >
              <DooAvatar id={doo.dooId} size={22} className="rounded shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium truncate leading-tight">{doo.dooName}</p>
                <p className="text-[10px] font-mono text-text-subtle leading-none mt-0.5">
                  {doo.keyCount} · {doo.formattedSize}
                </p>
              </div>
              {isActive && <ChevronRight size={12} className="text-text-subtle shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="h-10 border-t border-border px-4 flex items-center justify-between shrink-0">
        <span className="text-[10px] text-text-subtle uppercase tracking-widest">Total</span>
        <span className="text-[11px] font-mono text-text-muted">{totalDisplay}</span>
      </div>
    </div>
  );
}
