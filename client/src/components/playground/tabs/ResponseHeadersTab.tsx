import React from "react";
import { Terminal } from "lucide-react";

interface ResponseHeadersTabProps {
  headers: Record<string, string>;
}

export const ResponseHeadersTab: React.FC<ResponseHeadersTabProps> = ({
  headers,
}) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 min-h-0 space-y-6">
      <div className="flex items-center gap-2.5">
        <Terminal size={13} className="text-text-muted/40" />
        <span className="text-[10px] font-black text-text-muted">
          Raw Protocol Handshake
        </span>
      </div>
      {Object.keys(headers).length > 0 ? (
        <div className="border border-border/60 rounded-none overflow-hidden bg-bg/50">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-4 py-2.5 text-[10px] font-bold text-text-muted w-2/5">
                  Key Identifier
                </th>
                <th className="px-4 py-2.5 text-[10px] font-bold text-text-muted border-l border-border/50">
                  Protocol Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {Object.entries(headers).map(([k, v]) => (
                <tr
                  key={k}
                  className="group hover:bg-surface/30 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-[11px] text-text-subtle whitespace-nowrap truncate select-all">
                    {k}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-text truncate border-l border-border/50 select-all font-bold">
                    {v}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center opacity-30 gap-4">
          <Terminal size={20} className="text-text-muted" />
          <p className="text-[11px] font-black text-text-muted">
            No header data
          </p>
        </div>
      )}
    </div>
  );
};
