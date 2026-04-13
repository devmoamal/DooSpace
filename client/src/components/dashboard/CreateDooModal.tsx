import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { useDooForm } from "@/hooks/useDooForm";
import { DOO_TEMPLATES, type DooTemplate } from "@/templates";

interface CreateDooModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateDooModal({ isOpen, onClose }: CreateDooModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<DooTemplate>(DOO_TEMPLATES[0]);

  const {
    name,
    setName,
    description,
    setDescription,
    error,
    isPending,
    handleSubmit,
  } = useDooForm({
    mode: "create",
    onClose,
    boilerplate: selectedTemplate.code,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create a new Doo"
      subtitle="Define your automated logic. Each Doo can be configured with specific code and deployment settings later."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <Select
              label="Blueprint"
              value={selectedTemplate.id}
              onChange={(e) => {
                const template = DOO_TEMPLATES.find((t) => t.id === e.target.value);
                if (template) setSelectedTemplate(template);
              }}
              helperText={selectedTemplate.description}
              horizontal
            >
              {DOO_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="h-px bg-border/40 w-full" />

          <div className="flex flex-col gap-1">
            <Input
              label="Doo Name"
              placeholder="e.g. User Management Engine"
              value={name}
              onChange={(e) => setName(e.target.value)}
              helperText="How should we identify this logic unit?"
              horizontal
              autoFocus
              required
            />

            <Textarea
              label="Purpose"
              placeholder="What problem does this Doo solve?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              helperText="Brief context for easier system orchestration."
              horizontal
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/40 mt-4">
          <Button
            type="button"
            variant="secondary"
            className="px-6 h-10"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className={cn(
              "px-8 h-10 transition-all",
              isPending && "opacity-50 cursor-not-allowed",
            )}
            disabled={isPending}
          >
            {isPending ? "Initializing..." : `Deploy ${selectedTemplate.name}`}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
