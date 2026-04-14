import { Trash2 } from "lucide-react";

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
    <div className="border border-border rounded overflow-hidden">
      <table className="w-full text-left text-[12px]">
        <thead className="bg-surface border-b border-border">
          <tr>
            <th className="px-3 py-2 font-medium text-text-muted w-[45%]">
              Key
            </th>
            <th className="px-3 py-2 font-medium text-text-muted border-l border-border w-[45%]">
              Value
            </th>
            <th className="px-3 py-2 w-[10%] border-l border-border"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {displayItems.map((item, idx) => (
            <tr key={idx} className="group">
              <td className="p-0">
                <input
                  value={item.k}
                  onChange={(e) => update(idx, "k", e.target.value)}
                  className="w-full bg-transparent border-none outline-none px-3 py-2 font-mono text-text"
                  placeholder="Key"
                />
              </td>
              <td className="p-0 border-l border-border">
                <input
                  value={item.v}
                  onChange={(e) => update(idx, "v", e.target.value)}
                  className="w-full bg-transparent border-none outline-none px-3 py-2 font-mono text-text"
                  placeholder="Value"
                />
              </td>
              <td className="p-0 border-l border-border">
                {idx < displayItems.length - 1 && (
                  <button
                    onClick={() => remove(idx)}
                    className="w-full h-full flex items-center justify-center text-text-subtle hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
