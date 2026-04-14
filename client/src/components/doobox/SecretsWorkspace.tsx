import { useState } from "react";
import { KeyRound, Plus, Trash2, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSecretsQuery, useDeleteSecretMutation } from "@/hooks/queries/useSecrets";
import { AddSecretModal } from "./AddSecretModal";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SecretsWorkspace() {
  const [isAdding, setIsAdding] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const { data: secrets = [], isLoading } = useSecretsQuery();
  const deleteMutation = useDeleteSecretMutation();

  const toggleReveal = (name: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleDelete = async (name: string) => {
    if (!window.confirm(`Delete secret "${name}"? This cannot be undone.`)) return;
    try {
      await deleteMutation.mutateAsync(name);
      toast.success(`Secret ${name} deleted`);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-bg overflow-hidden">
      {/* Header */}
      <header className="h-11 border-b border-border flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-medium text-text">Secrets</span>
          <span className="text-[11px] font-mono text-text-subtle tabular-nums">
            {secrets.length} {secrets.length === 1 ? "secret" : "secrets"}
          </span>
        </div>
        <Button size="sm" onClick={() => setIsAdding(true)} className="gap-1.5">
          <Plus size={13} />
          Add
        </Button>
      </header>

      {/* Info Banner */}
      <div className="px-5 py-3 border-b border-border bg-surface shrink-0">
        <div className="flex items-start gap-2.5">
          <ShieldCheck size={13} className="text-brand mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <p className="text-[11px] text-text-muted">
              Secrets are available to all your Doos at runtime. Access them with{" "}
              <code className="font-mono text-brand text-[11px]">import {"{ secrets }"} from "doospace"</code>
            </p>
            <p className="text-[11px] text-text-subtle">
              Values are write-only — they are never returned by the API.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 size={18} className="animate-spin text-text-subtle" />
          </div>
        ) : secrets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-20">
            <KeyRound size={24} className="text-text-subtle" />
            <p className="text-[12px] text-text-subtle">No secrets yet</p>
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(true)} className="gap-1.5">
              <Plus size={12} />
              Add your first secret
            </Button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-bg border-b border-border z-20">
              <tr>
                <th className="w-8 px-4 py-2.5" />
                <th className="px-4 py-2.5 text-[10px] font-medium text-text-subtle uppercase tracking-widest">Name</th>
                <th className="px-4 py-2.5 text-[10px] font-medium text-text-subtle uppercase tracking-widest">Value</th>
                <th className="px-4 py-2.5 text-[10px] font-medium text-text-subtle uppercase tracking-widest">Created</th>
                <th className="w-20 px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {secrets.map((secret) => {
                const isRevealed = revealed.has(secret.name);
                return (
                  <tr
                    key={secret.id}
                    className="border-b border-border group transition-colors hover:bg-surface"
                  >
                    <td className="px-4 py-3">
                      <div className="w-[2px] h-3 bg-border group-hover:bg-brand rounded-full transition-colors" />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] font-mono text-text tracking-wide">{secret.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-[12px] font-mono transition-all",
                            isRevealed ? "text-amber-500" : "text-text-subtle tracking-widest"
                          )}
                        >
                          {isRevealed ? "••••••••" : "••••••••"}
                        </span>
                        <button
                          onClick={() => toggleReveal(secret.name)}
                          className="text-text-subtle hover:text-text-muted transition-colors cursor-pointer"
                        >
                          {isRevealed ? <Eye size={11} /> : <EyeOff size={11} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-mono text-text-subtle">{formatDate(secret.created_at)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(secret.name)}
                        className="p-1 text-text-subtle hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer rounded hover:bg-red-500/10"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <AddSecretModal isOpen={isAdding} onClose={() => setIsAdding(false)} />
    </div>
  );
}
