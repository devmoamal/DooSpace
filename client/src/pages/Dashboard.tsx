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
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-brand" size={32} />
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col h-full bg-bg">
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-bg sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-text">Overview</h1>
            <div className="h-4 w-px bg-border mx-2" />
            <p className="text-xs text-text-muted font-medium">
              Resources & Performance
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            size="sm"
            className="gap-2"
          >
            <Plus size={14} />
            <span>New Doo</span>
          </Button>
        </header>

        <main className="p-8 space-y-10 overflow-y-auto custom-scrollbar">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/doo">
              <StatsCard
                label="Total Doos"
                value={stats?.doos?.total || 0}
                Doo="Active Doos"
                icon={<LayoutGrid size={20} />}
                trend={
                  stats?.doos?.active && stats.doos.total
                    ? Math.round(
                        (stats.doos.active / stats.doos.total) *
                          100,
                      )
                    : 0
                }
                className="cursor-pointer"
              />
            </Link>
            <Link to="/requests">
              <StatsCard
                label="Requests"
                value={stats?.requests?.total || 0}
                Doo="Total Executed"
                icon={<Activity size={20} />}
                trend={stats?.requests?.trend}
                className="cursor-pointer"
              />
            </Link>
            <Link to="/storage">
              <StatsCard
                label="Storage"
                value={stats?.storage?.formattedSize || "0 B"}
                Doo={String(stats?.storage?.totalKeys || 0) + " keys"}
                icon={<Database size={20} />}
                className="cursor-pointer"
              />
            </Link>
          </div>

          {/* Chart Section */}
          <div className="pt-4">
            <RequestsChart
              data={charts || []}
              successRate={stats?.requests?.successRate}
            />
          </div>
        </main>
      </div>

      <CreateDooModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}


