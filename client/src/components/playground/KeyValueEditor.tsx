import { Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { IconButton } from "@/components/ui/IconButton";

export interface KeyValueItem {
  k: string;
  v: string;
}

interface KeyValueEditorProps {
  items: KeyValueItem[];
  onChange: (items: KeyValueItem[]) => void;
}

export function KeyValueEditor({ items, onChange }: KeyValueEditorProps) {
  // ensure there's always one empty row at the bottom
  const displayItems = [...items];
  const last = displayItems[displayItems.length - 1];
  if (displayItems.length === 0 || last?.k !== "" || last?.v !== "") {
    displayItems.push({ k: "", v: "" });
  }

  const update = (idx: number, field: "k" | "v", val: string) => {
    const next = [...displayItems];
    next[idx] = { ...next[idx], [field]: val };
    // strip empty trailing rows before sending up
    const filtered = next.filter(
      (item, i) => i === next.length - 1 || item.k || item.v,
    );
    onChange(filtered);
  };

  const remove = (idx: number) => {
    const next = [...displayItems];
    next.splice(idx, 1);
    onChange(
      next.filter((item, i) => i === next.length - 1 || item.k || item.v),
    );
  };

  return (
    <div className="border border-border rounded-none overflow-hidden bg-bg/50">
      <table className="w-full text-left border-collapse table-fixed">
        <thead className="bg-surface/80 border-b border-border">
          <tr>
            <th className="px-4 py-2 text-[10px] font-bold text-text-muted w-[45%]">
              Identifier
            </th>
            <th className="px-4 py-2 text-[10px] font-bold text-text-muted border-l border-border w-[45%]">
              Payload
            </th>
            <th className="px-4 py-2 w-[10%] border-l border-border"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {displayItems.map((item, idx) => (
            <tr key={idx} className="group hover:bg-surface/30 transition-colors">
              <td className="p-0">
                <input
                  value={item.k}
                  onChange={(e) => update(idx, "k", e.target.value)}
                  className="w-full bg-transparent border-none outline-none px-4 py-2.5 font-mono text-[12px] text-text placeholder:text-text-subtle/50"
                  placeholder="key_name"
                />
              </td>
              <td className="p-0 border-l border-border/50">
                <input
                  value={item.v}
                  onChange={(e) => update(idx, "v", e.target.value)}
                  className="w-full bg-transparent border-none outline-none px-4 py-2.5 font-mono text-[12px] text-text placeholder:text-text-subtle/50"
                  placeholder="value_data"
                />
              </td>
              <td className="p-0 border-l border-border/50">
                <div className="flex items-center justify-center h-full">
                  {idx < displayItems.length - 1 && (
                    <IconButton
                      onClick={() => remove(idx)}
                      variant="ghost"
                      size="xs"
                      title="Remove row"
                      className="text-text-subtle hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={13} />
                    </IconButton>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
