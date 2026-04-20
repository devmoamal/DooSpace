import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { useDooForm } from "@/hooks/useDooForm";
import { DOO_TEMPLATES, type DooTemplate } from "@/templates";
import { cn } from "@/lib/cn";

interface CreateDooModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateDooModal({ isOpen, onClose }: CreateDooModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<DooTemplate>(DOO_TEMPLATES[0]);

  const {
    name, setName,
    description, setDescription,
    error, isPending, handleSubmit,
  } = useDooForm({
    mode: "create",
    onClose,
    boilerplate: selectedTemplate.code,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Doo"
      subtitle="Define a new high-performance logic unit."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        {error && (
          <div className="mb-6 px-4 py-3 border border-red-500/20 rounded-none text-red-500 text-[11px] font-mono bg-red-500/5 flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-5">
          <Input
            label="NAME"
            placeholder="e.g. My Processing Logic"
            value={name}
            onChange={(e) => setName(e.target.value)}
            helperText="The unique identifier for this Doo unit."
            autoFocus
            required
            className="h-10"
          />

          <Textarea
            label="DESCRIPTION"
            placeholder="What is the purpose of this logic?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            helperText="Optional context for your team and orchestration."
            className="min-h-[100px]"
          />

          <Select
            label="BLUEPRINT"
            value={selectedTemplate.id}
            onChange={(e) => {
              const t = DOO_TEMPLATES.find((t) => t.id === e.target.value);
              if (t) setSelectedTemplate(t);
            }}
            helperText={selectedTemplate.description}
          >
            {DOO_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </Select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-8 border-t border-border mt-10">
          <Button type="button" variant="ghost" size="md" onClick={onClose} className="px-6">
            Cancel
          </Button>
          <Button
            type="submit"
            size="md"
            className={cn("px-8 font-bold", isPending && "opacity-50 cursor-not-allowed")}
            disabled={isPending}
          >
            {isPending ? "Creating…" : `Launch ${selectedTemplate.name}`}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
