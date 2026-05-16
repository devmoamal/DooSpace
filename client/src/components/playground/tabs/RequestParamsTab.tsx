import React from "react";
import { Globe } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface RequestParamsTabProps {
  pathParams: string[];
  params: Record<string, string>;
  onParamsChange: (p: Record<string, string>) => void;
}

export const RequestParamsTab: React.FC<RequestParamsTabProps> = ({
  pathParams,
  params,
  onParamsChange,
}) => {
  if (pathParams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center opacity-30 gap-4">
        <div className="w-12 h-12 rounded-none bg-surface border border-border border-dashed flex items-center justify-center">
          <Globe size={18} className="text-text-muted" />
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-black text-text-muted">Static Route</p>
          <p className="text-[10px] font-mono leading-relaxed max-w-[160px]">
            No dynamic path bindings identified for this execution trace.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <Globe size={13} className="text-text-muted/40" />
        <span className="text-[10px] font-black text-text-muted">
          Path Segment Bindings
        </span>
        <Badge
          variant="neutral"
          size="xs"
          className="tabular-nums font-mono opacity-50 px-1.5 h-4.5"
        >
          {pathParams.length}
        </Badge>
      </div>
      <div className="border border-border/60 rounded-none overflow-hidden bg-bg/50">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="px-4 py-2.5 text-[10px] font-bold text-text-muted w-1/3">
                Identifier
              </th>
              <th className="px-4 py-2.5 text-[10px] font-bold text-text-muted border-l border-border/50">
                Mapping Value
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {pathParams.map((p) => (
              <tr
                key={p}
                className="group hover:bg-surface/30 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-[11px] text-text-subtle whitespace-nowrap">
                  <span className="text-brand/60 font-black mr-1">:</span>
                  {p}
                </td>
                <td className="p-0 border-l border-border/50">
                  <input
                    value={params[p] || ""}
                    onChange={(e) =>
                      onParamsChange({
                        ...params,
                        [p]: e.target.value,
                      })
                    }
                    className="w-full bg-transparent border-none outline-none px-4 py-3 font-mono text-text text-[12px] placeholder:text-text-subtle/30 focus:bg-bg transition-colors font-bold"
                    placeholder={`Bind ${p}...`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
