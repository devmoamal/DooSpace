import { useState, useCallback, useEffect } from "react";
import { useUpdateDooMutation } from "@/hooks/queries/useDoos";
import { toast } from "sonner";
import * as prettier from "prettier/standalone";
import * as babel from "prettier/plugins/babel";
import * as estree from "prettier/plugins/estree";

interface UseDooEditorOptions {
  id: number;
  initialCode?: string;
}

export const useDooEditor = ({ id, initialCode = "" }: UseDooEditorOptions) => {
  const [code, setCode] = useState(initialCode);
  const [isFormatting, setIsFormatting] = useState(false);
  const updateMutation = useUpdateDooMutation();

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  const formatCode = useCallback(async (codeToFormat: string): Promise<string> => {
    try {
      return await prettier.format(codeToFormat, {
        parser: "babel",
        plugins: [babel, estree],
        semi: true,
        singleQuote: false,
      });
    } catch (e) {
      console.warn("Formatting failed:", e);
      return codeToFormat;
    }
  }, []);

  const handleFormat = useCallback(async () => {
    setIsFormatting(true);
    try {
      const formatted = await formatCode(code);
      if (formatted !== code) {
        setCode(formatted);
        toast.success("Code formatted");
      }
    } catch (error: any) {
      toast.error("Format error: " + error.message);
    } finally {
      setIsFormatting(false);
    }
  }, [code, formatCode]);

  const handleSave = useCallback(async () => {
    setIsFormatting(true);
    try {
      // Auto-format before saving
      const formattedCode = await formatCode(code);
      if (formattedCode !== code) {
        setCode(formattedCode);
      }

      await updateMutation.mutateAsync({ id, data: { code: formattedCode } });
      toast.success("Doo saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save");
    } finally {
      setIsFormatting(false);
    }
  }, [id, code, formatCode, updateMutation]);

  const handleSync = useCallback(() => {
    updateMutation.mutate(
      { id, data: { code } },
      {
        onSuccess: () => toast.success("Configuration synced"),
        onError: (err: any) => toast.error(err.message || "Sync failed"),
      },
    );
  }, [id, code, updateMutation]);

  return {
    code,
    setCode,
    isFormatting,
    isSaving: updateMutation.isPending,
    handleFormat,
    handleSave,
    handleSync,
  };
};
