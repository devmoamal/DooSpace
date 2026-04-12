import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dooService } from "@/services/doo.service";
import { QUERY_KEYS } from "@/constants";
import type { Doo } from "@doospace/shared";

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

export function useDoosQuery(params?: any) {
  return useQuery<PaginatedResponse<Doo>>({
    queryKey: QUERY_KEYS.DOOS.LIST(params),
    queryFn: async () => {
      const res = await dooService.getAll(params);
      if (!res.ok) throw new Error(res.message);
      return res.data as any;
    },
  });
}

export function useDooQuery(id: number) {
  return useQuery<Doo | null>({
    queryKey: QUERY_KEYS.DOOS.DETAIL(id),
    queryFn: async () => {
      const res = await dooService.getById(id);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateDooMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Doo>) => {
      const res = await dooService.create(data);
      if (!res.ok) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOOS.ALL });
    },
  });
}

export function useUpdateDooMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Doo> }) => {
      const res = await dooService.update(id, data);
      if (!res.ok) throw new Error(res.message);
      return res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOOS.ALL });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DOOS.DETAIL(variables.id),
      });
    },
  });
}

export function useDeleteDooMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await dooService.delete(id);
      if (!res.ok) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOOS.ALL });
    },
  });
}

export function useToggleDooMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await dooService.toggleActive(id);
      if (!res.ok) throw new Error(res.message);
      return res;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOOS.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOOS.DETAIL(id) });
    },
  });
}
