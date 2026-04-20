import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "@/services/settings.service";
import { toast } from "sonner";

export const useSettings = () => {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ["settings"],
    queryFn: settingsService.getSettings,
  });

  const updateSettingMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      settingsService.updateSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Project configuration updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update setting");
    },
  });

  return {
    settings: settingsQuery.data || [],
    isLoading: settingsQuery.isLoading,
    updateSetting: updateSettingMutation.mutateAsync,
    isUpdating: updateSettingMutation.isPending,
  };
};

export const useAIProviders = () => {
  return useQuery({
    queryKey: ["ai-providers"],
    queryFn: settingsService.getProviders,
  });
};

export const useAIModels = (provider: string | null) => {
  return useQuery({
    queryKey: ["ai-models", provider],
    queryFn: () => settingsService.getModels(provider!),
    enabled: !!provider,
  });
};
