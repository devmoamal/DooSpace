import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { secretsService, type SecretMeta } from "@/services/secrets.service";
import { QUERY_KEYS } from "@/constants";

export function useSecretsQuery() {
  return useQuery<SecretMeta[]>({
    queryKey: QUERY_KEYS.SECRETS.ALL,
    queryFn: async () => {
      const res = await secretsService.list();
      if (!res.ok) throw new Error(res.message);
      return res.data || [];
    },
  });
}

export function useCreateSecretMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, value }: { name: string; value: string }) =>
      secretsService.set(name, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SECRETS.ALL });
    },
  });
}

export function useDeleteSecretMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => secretsService.delete(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SECRETS.ALL });
    },
  });
}
