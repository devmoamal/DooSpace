import { useQuery } from "@tanstack/react-query";
import { overviewService } from "@/services/overview.service";
import { QUERY_KEYS } from "@/constants";
import type { OverviewStats, ChartDataPoint } from "@doospace/shared";

export function useOverviewStatsQuery() {
  return useQuery<OverviewStats | null>({
    queryKey: QUERY_KEYS.OVERVIEW.STATS,
    queryFn: async () => {
      const res = await overviewService.getStats();
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    staleTime: 30000,
  });
}

export function useOverviewChartsQuery() {
  return useQuery<ChartDataPoint[] | null>({
    queryKey: QUERY_KEYS.OVERVIEW.CHARTS,
    queryFn: async () => {
      const res = await overviewService.getCharts();
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    staleTime: 60000,
  });
}
