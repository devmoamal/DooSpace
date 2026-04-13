import { useState } from "react";
import { Plus, Loader2, Activity, Database, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CreateDooModal } from "@/components/dashboard/CreateDooModal";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RequestsChart } from "@/components/dashboard/RequestsChart";
import { useOverviewStatsQuery, useOverviewChartsQuery } from "@/hooks/queries/useOverview";
import { Link } from "@tanstack/react-router";

export function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: stats, isLoading: isStatsLoading } = useOverviewStatsQuery();
  const { data: charts, isLoading: isChartLoading } = useOverviewChartsQuery();

  if (isStatsLoading || isChartLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-bg">
        <Loader2 className="animate-spin text-text-subtle" size={18} />
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col h-full bg-bg">
        <header className="h-11 border-b border-border flex items-center justify-between px-5 sticky top-0 bg-bg z-10 shrink-0">
          <h1 className="text-[13px] font-semibold text-text">Overview</h1>
          <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-1.5">
            <Plus size={13} />
            New Doo
          </Button>
        </header>

        <main className="p-5 space-y-5 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link to="/doo">
              <StatsCard
                label="Doos"
                value={stats?.doos?.total || 0}
                Doo={`${stats?.doos?.active || 0} active`}
                trend={
                  stats?.doos?.active && stats.doos.total
                    ? Math.round((stats.doos.active / stats.doos.total) * 100)
                    : 0
                }
                className="cursor-pointer"
              />
            </Link>
            <Link to="/requests">
              <StatsCard
                label="Requests"
                value={stats?.requests?.total || 0}
                Doo="total"
                trend={stats?.requests?.trend}
                className="cursor-pointer"
              />
            </Link>
            <Link to="/doobox">
              <StatsCard
                label="DooBox"
                value={stats?.doobox?.formattedSize || "0 B"}
                Doo={`${stats?.doobox?.totalKeys || 0} keys`}
                className="cursor-pointer"
              />
            </Link>
          </div>

          <RequestsChart data={charts || []} successRate={stats?.requests?.successRate} />
        </main>
      </div>

      <CreateDooModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
