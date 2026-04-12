import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storageService } from "@/services/storage.service";
import { QUERY_KEYS } from "@/constants";
import type { DooStorageUsage } from "@doospace/shared";

export function useStorageUsageQuery() {
  return useQuery<DooStorageUsage[]>({
    queryKey: QUERY_KEYS.STORAGE.USAGE,
    queryFn: async () => {
      const res = await storageService.getUsage();
      if (!res.ok) throw new Error(res.message);
      return res.data || [];
    },
  });
}

export function useDooStorageQuery(dooId: number) {
  return useQuery<any[]>({
    queryKey: QUERY_KEYS.STORAGE.DETAIL(dooId),
    queryFn: async () => {
      const res = await storageService.getKeys(dooId);
      if (!res.ok) throw new Error(res.message);
      return res.data || [];
    },
    enabled: !!dooId,
  });
}

export function useSetStorageKeyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      dooId,
      key,
      value,
    }: {
      dooId: number;
      key: string;
      value: any;
    }) => storageService.setKey(dooId, key, value),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.STORAGE.DETAIL(variables.dooId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STORAGE.USAGE });
    },
  });
}

export function useDeleteStorageKeyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dooId, key }: { dooId: number; key: string }) =>
      storageService.deleteKey(dooId, key),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.STORAGE.DETAIL(variables.dooId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STORAGE.USAGE });
    },
  });
}
