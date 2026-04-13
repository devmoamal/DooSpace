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
      title="Create Doo"
      subtitle="Define your automated logic unit."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        {error && (
          <p className="mb-4 px-3 py-2 border border-red-500/20 rounded text-red-500 text-[11px] font-mono bg-red-500/5">
            {error}
          </p>
        )}

        <div className="space-y-1">
          <Input
            label="Name"
            placeholder="e.g. User Management"
            value={name}
            onChange={(e) => setName(e.target.value)}
            helperText="Identifier for this logic unit"
            horizontal
            autoFocus
            required
          />

          <Textarea
            label="Purpose"
            placeholder="What does this Doo do?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            helperText="Optional context for orchestration"
            horizontal
          />
        </div>

        <div className="h-px bg-border my-4" />

        <Select
          label="Blueprint"
          value={selectedTemplate.id}
          onChange={(e) => {
            const t = DOO_TEMPLATES.find((t) => t.id === e.target.value);
            if (t) setSelectedTemplate(t);
          }}
          helperText={selectedTemplate.description}
          horizontal
        >
          {DOO_TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </Select>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border mt-4">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            className={cn(isPending && "opacity-50 cursor-not-allowed")}
            disabled={isPending}
          >
            {isPending ? "Creating…" : `Deploy ${selectedTemplate.name}`}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
