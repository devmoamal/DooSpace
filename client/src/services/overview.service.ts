import api, { handleRequest } from "@/lib/api";
import type { OverviewStats, ChartDataPoint } from "@doospace/shared";

export const overviewService = {
  getStats: () =>
    handleRequest<OverviewStats>(api.get("/overview/stats")),

  getCharts: () =>
    handleRequest<ChartDataPoint[]>(api.get("/overview/charts")),
};

