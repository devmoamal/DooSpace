import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loopService, type PaginatedResponse } from "@/services/loop.service";
import { QUERY_KEYS } from "@/constants";
import type { Loop, CreateLoopDTO, UpdateLoopDTO, LoopLog } from "@doospace/shared";

export function useLoopsQuery(params?: any) {
  return useQuery<PaginatedResponse<Loop>>({
    queryKey: QUERY_KEYS.LOOPS.LIST(params),
    queryFn: async () => {
      const res = await loopService.getAll(params);
      if (!res.ok) throw new Error(res.message);
      return res.data as any;
    },
  });
}

export function useLoopQuery(id: string) {
  return useQuery<Loop | null>({
    queryKey: QUERY_KEYS.LOOPS.DETAIL(id),
    queryFn: async () => {
      const res = await loopService.getById(id);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateLoopMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateLoopDTO) => {
      const res = await loopService.create(data);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LOOPS.ALL });
    },
  });
}

export function useUpdateLoopStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "active" | "paused" }) => {
      const res = await loopService.updateStatus(id, status);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LOOPS.ALL });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.LOOPS.DETAIL(variables.id),
      });
    },
  });
}

export function useDeleteLoopMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await loopService.delete(id);
      if (!res.ok) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LOOPS.ALL });
    },
  });
}

export function useUpdateLoopMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLoopDTO }) => {
      const res = await loopService.update(id, data);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LOOPS.ALL });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.LOOPS.DETAIL(variables.id),
      });
    },
  });
}

export function useLoopLogsQuery(id: string, params?: any) {
  return useQuery<PaginatedResponse<LoopLog>>({
    queryKey: [...QUERY_KEYS.LOOPS.DETAIL(id), "logs", params],
    queryFn: async () => {
      const res = await loopService.getLogs(id, params);
      if (!res.ok) throw new Error(res.message);
      return res.data as any;
    },
    enabled: !!id,
  });
}
