import { useState, useEffect } from "react";
import { useCreateDooMutation, useUpdateDooMutation } from "@/hooks/queries/useDoos";
import { toast } from "sonner";
import { type Doo } from "@doospace/shared";

interface UseDooFormOptions {
  mode: "create" | "edit";
  initialData?: Partial<Doo>;
  onSuccess?: (res: any) => void;
  onClose: () => void;
  boilerplate?: string;
}

export function useDooForm({
  mode,
  initialData,
  onSuccess,
  onClose,
  boilerplate,
}: UseDooFormOptions) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const createMutation = useCreateDooMutation();
  const updateMutation = useUpdateDooMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Initialize form with initialData for edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
    } else if (mode === "create") {
      setName("");
      setDescription("");
      setError("");
    }
  }, [initialData, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isPending) return;

    setError("");

    const handleRes = (res: any) => {
      if (res.ok) {
        if (mode === "create") {
          setName("");
          setDescription("");
          toast.success("Doo created successfully");
        } else {
          toast.success("Doo updated successfully");
        }
        onSuccess?.(res);
        onClose();
      } else {
        setError(res.message || `Failed to ${mode} Doo.`);
      }
    };

    const handleErr = (err: any) => {
      setError(err?.message || "An unexpected error occurred.");
    };

    if (mode === "create") {
      createMutation.mutate(
        {
          name: name.trim(),
          description: description.trim(),
          code: boilerplate,
        },
        { onSuccess: handleRes, onError: handleErr }
      );
    } else if (mode === "edit" && initialData?.id) {
      updateMutation.mutate(
        {
          id: initialData.id,
          data: {
            name: name.trim(),
            description: description.trim(),
          },
        },
        { onSuccess: handleRes, onError: handleErr }
      );
    }
  };

  return {
    name,
    setName,
    description,
    setDescription,
    error,
    setError,
    isPending,
    handleSubmit,
  };
}
