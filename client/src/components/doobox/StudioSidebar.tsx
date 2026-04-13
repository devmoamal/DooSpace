import { Search, Database, ExternalLink, ChevronRight } from "lucide-react";
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
  usage,
  selectedDooId,
  onSelect,
  searchTerm,
  onSearchChange,
}: StudioSidebarProps) {
  const filteredUsage = usage.filter(u => 
    u.dooName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.dooId.toString().includes(searchTerm)
  );

  return (
    <div className="w-72 border-r border-border bg-surface/30 flex flex-col shrink-0">
      <div className="p-4 border-b border-border bg-bg/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/40" size={14} />
          <input
            className="w-full h-9 pl-9 pr-4 bg-bg border border-border rounded-lg text-[11px] font-medium placeholder:text-text-muted/40 outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all"
            placeholder="Search Doos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        <div className="px-3 py-2">
          <p className="text-[10px] font-extrabold text-text-muted uppercase tracking-[0.2em] mb-4">
            Doo Units
          </p>
          <div className="space-y-1">
            {filteredUsage.map((doo) => {
              const isActive = selectedDooId === doo.dooId;
              return (
                <button
                  key={doo.dooId}
                  onClick={() => onSelect(doo)}
                  className={cn(
                    "w-full flex items-center justify-between p-2.5 rounded-lg transition-all group relative",
                    isActive 
                      ? "bg-brand/10 border border-brand/20 shadow-sm" 
                      : "hover:bg-surface border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <DooAvatar 
                      id={doo.dooId} 
                      size={24} 
                      className={cn(
                        "rounded ring-1 transition-all",
                        isActive ? "ring-brand/40" : "ring-border/50 group-hover:ring-brand/20"
                      )} 
                    />
                    <div className="text-left min-w-0">
                      <p className={cn(
                        "text-[11px] font-bold truncate leading-tight transition-colors",
                        isActive ? "text-brand" : "text-text group-hover:text-brand"
                      )}>
                        {doo.dooName}
                      </p>
                      <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest leading-none mt-1">
                        {doo.keyCount} items • {doo.formattedSize}
                      </p>
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-1 absolute left-0 top-2 bottom-2 bg-brand rounded-r-full" />
                  )}
                  <ChevronRight 
                    size={12} 
                    className={cn(
                      "transition-all shrink-0",
                      isActive ? "text-brand translate-x-0 opacity-100" : "text-text-muted -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    )} 
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border bg-bg/50">
        <div className="flex items-center justify-between text-[10px] font-bold text-text-muted uppercase tracking-widest">
          <span>Global Stats</span>
          <span className="text-brand">
            {usage.reduce((acc, curr) => acc + curr.sizeBytes, 0) > 1024 
              ? `${(usage.reduce((acc, curr) => acc + curr.sizeBytes, 0) / 1024).toFixed(1)} KB`
              : `${usage.reduce((acc, curr) => acc + curr.sizeBytes, 0)} B`
            }
          </span>
        </div>
      </div>
    </div>
  );
}
