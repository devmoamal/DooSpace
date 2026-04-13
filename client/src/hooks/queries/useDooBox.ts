import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dooboxService } from "@/services/doobox.service";
import { QUERY_KEYS } from "@/constants";
import type { DooBoxUsage } from "@doospace/shared";

export function useDooBoxUsageQuery() {
  return useQuery<DooBoxUsage[]>({
    queryKey: QUERY_KEYS.DOOBOX.USAGE,
    queryFn: async () => {
      const res = await dooboxService.getUsage();
      if (!res.ok) throw new Error(res.message);
      return res.data || [];
    },
  });
}

export function useDooDooBoxQuery(dooId: number) {
  return useQuery<any[]>({
    queryKey: QUERY_KEYS.DOOBOX.DETAIL(dooId),
    queryFn: async () => {
      const res = await dooboxService.getKeys(dooId);
      if (!res.ok) throw new Error(res.message);
      return res.data || [];
    },
    enabled: !!dooId,
  });
}

export function useSetDooBoxKeyMutation() {
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
    }) => dooboxService.setKey(dooId, key, value),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DOOBOX.DETAIL(variables.dooId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOOBOX.USAGE });
    },
  });
}

export function useDeleteDooBoxKeyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dooId, key }: { dooId: number; key: string }) =>
      dooboxService.deleteKey(dooId, key),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DOOBOX.DETAIL(variables.dooId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOOBOX.USAGE });
    },
  });
}
