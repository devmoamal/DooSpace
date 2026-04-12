import { useState } from "react";
import { Loader2, Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DooAvatar } from "@/components/ui/DooAvatar";
import { type DooStorageUsage } from "@doospace/shared";
import { useStorageUsageQuery } from "@/hooks/queries/useStorage";
import { StorageExplorer } from "@/components/storage/StorageExplorer";

export function StoragePage() {
  const [selectedDoo, setSelectedDoo] = useState<DooStorageUsage | null>(null);

  const { data: usage = [], isLoading } = useStorageUsageQuery();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-brand" size={32} />
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col h-full bg-bg overflow-hidden">
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-bg sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-text">Storage</h1>
            <div className="h-4 w-px bg-border mx-2" />
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1">
                  Total Keys
                </p>
                <p className="text-sm font-bold text-text leading-none">
                  {usage.reduce((acc: number, curr: DooStorageUsage) => acc + curr.keyCount, 0)}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1">
                  Resource Size
                </p>
                <p className="text-sm font-bold text-brand leading-none">
                  {(usage.reduce((acc: number, curr: DooStorageUsage) => acc + curr.sizeBytes, 0) / 1024).toFixed(1)} KB
                </p>

              </div>
            </div>
          </div>
          <Button size="sm" variant="secondary" className="gap-2">
            <Plus size={14} />
            <span>Manage Policies</span>
          </Button>
        </header>

        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {usage.map((item: DooStorageUsage) => (
              <div
                key={item.dooId}

                onClick={() => setSelectedDoo(item)}
                className="bg-surface/50 border border-border hover:border-brand/40 hover:bg-surface rounded-lg p-6 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-6">
                  <DooAvatar
                    id={item.dooId}
                    size={40}
                    className="rounded-md ring-1 ring-border/50"
                  />
                  <div className="p-2 bg-text/5 text-text-muted rounded-md group-hover:bg-brand/10 group-hover:text-brand transition-colors">
                    <ExternalLink size={16} />
                  </div>
                </div>

                <div className="mb-6 space-y-1">
                  <h3 className="text-sm font-semibold text-text group-hover:text-brand transition-colors truncate">
                    {item.dooName}
                  </h3>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em]">
                    Doo_{item.dooId}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/40">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">
                      Records
                    </p>
                    <p className="text-lg font-bold text-text">
                      {item.keyCount}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">
                      Resources
                    </p>
                    <p className="text-lg font-bold text-brand">
                      {item.formattedSize}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <StorageExplorer
        doo={selectedDoo}
        onClose={() => setSelectedDoo(null)}
      />
    </>
  );
}

