import { useQuery } from "@tanstack/react-query";
import { requestService } from "@/services/request.service";
import { QUERY_KEYS } from "@/constants";

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

export function useRequestsQuery(params?: any) {
  return useQuery<PaginatedResponse<any>>({
    queryKey: QUERY_KEYS.REQUESTS.LIST(params),
    queryFn: async () => {
      const res = await requestService.getAll(params);
      if (!res.ok) throw new Error(res.message);
      return res.data as any;
    },
    refetchInterval: 5000,
  });
}

export function useDooLogsQuery(dooId: number) {
  return useQuery<any[]>({
    queryKey: QUERY_KEYS.REQUESTS.LOGS(dooId),
    queryFn: async () => {
      const res = await requestService.getByDoo(dooId);
      if (!res.ok) throw new Error(res.message);
      return res.data || [];
    },
    enabled: !!dooId,
    refetchInterval: 5000,
  });
}
