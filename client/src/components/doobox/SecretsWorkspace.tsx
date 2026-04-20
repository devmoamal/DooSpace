import { useState } from "react";
import { KeyRound, Plus, Trash2, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  useSecretsQuery,
  useDeleteSecretMutation,
} from "@/hooks/queries/useSecrets";
import { AddSecretModal } from "./AddSecretModal";
import { toast } from "sonner";
import { type SecretMeta } from "@/services/secrets.service";
import { Badge } from "../ui/Badge";
import { IconButton } from "../ui/IconButton";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SecretsWorkspace() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingSecret, setEditingSecret] = useState<SecretMeta | null>(null);

  const { data: secrets = [], isLoading } = useSecretsQuery();
  const deleteMutation = useDeleteSecretMutation();

  const handleDelete = async (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    if (!window.confirm(`Delete secret "${name}"? This cannot be undone.`))
      return;
    try {
      await deleteMutation.mutateAsync(name);
      toast.success(`Secret ${name} deleted`);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-bg overflow-hidden rounded-none border-l border-border/50">
      {/* Header */}
      <header className="h-11 border-b border-border flex items-center justify-between px-5 shrink-0 bg-bg/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-[11px] font-bold text-text-muted">
            Environment Secrets
          </h1>
          <Badge
            variant="neutral"
            size="xs"
            className="font-mono tabular-nums opacity-60 rounded-none"
          >
            {secrets.length} {secrets.length === 1 ? "SECRET" : "SECRETS"}
          </Badge>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAdding(true)}
          className="h-7.5 px-4 rounded-none gap-2 font-bold text-[10px]"
        >
          <Plus size={14} />
          Create Secret
        </Button>
      </header>

      {/* Info Banner */}
      <div className="px-5 py-4 border-b border-border bg-surface/30 shrink-0">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-none bg-brand/10 flex items-center justify-center shrink-0">
            <ShieldCheck size={16} className="text-brand" />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] text-text-muted font-medium leading-relaxed">
              Environment secrets are injected into the runtime at execution
              time via{" "}
              <code className="font-mono text-brand bg-brand/5 px-1 border border-brand/10">
                import {"{ secrets }"} from "doospace"
              </code>
            </p>
            <p className="text-[10px] font-bold text-text-subtle/60">
              ARCHITECTURE: Write-only infrastructure — values are never exposed
              to the client.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={24} className="animate-spin text-brand" />
          </div>
        ) : secrets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 opacity-30 gap-5">
            <div className="w-16 h-16 border border-dashed border-border flex items-center justify-center rounded-none">
              <KeyRound size={24} />
            </div>
            <div className="text-center space-y-1">
              <p className="text-[11px] font-bold tracking-[0.3em]">
                No Secrets Found
              </p>
              <p className="text-[10px] font-mono">Vault is currently empty</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsAdding(true)}
              className="gap-2 rounded-none text-[10px] font-bold"
            >
              <Plus size={14} />
              Provision Secret
            </Button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-bg/95 backdrop-blur-sm border-b border-border z-20">
              <tr>
                <th className="w-8 px-5 py-3" />
                <th className="px-5 py-3 text-[10px] font-bold text-text-muted">
                  Identifier
                </th>
                <th className="px-5 py-3 text-[10px] font-bold text-text-muted">
                  Created AT
                </th>
                <th className="px-5 py-3 text-right text-[10px] font-bold text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {secrets.map((secret) => {
                return (
                  <tr
                    key={secret.id}
                    onClick={() => setEditingSecret(secret)}
                    className="border-b border-border/50 group transition-all duration-150 hover:bg-surface/50 cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <div className="w-[2px] h-4 bg-border/50 group-hover:bg-brand transition-all duration-300" />
                    </td>
                    <td className="px-5 py-4">
                      <span className=" font-mono text-text font-bold text-xs px-2 py-1 transition-all rounded-none">
                        {secret.name}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[11px] font-mono text-text-subtle font-medium">
                        {formatDate(secret.created_at)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <IconButton
                        onClick={(e) => handleDelete(e, secret.name)}
                        variant="ghost"
                        size="xs"
                        className="text-text-subtle hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={13} />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <AddSecretModal
        isOpen={isAdding || !!editingSecret}
        initialData={editingSecret}
        onClose={() => {
          setIsAdding(false);
          setEditingSecret(null);
        }}
      />
    </div>
  );
}
