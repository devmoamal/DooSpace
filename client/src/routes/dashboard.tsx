import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/pages";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/dashboard")({
  component: DashboardComponent,
});

function DashboardComponent() {
  return (
    <AppLayout>
      <DashboardPage />
    </AppLayout>
  );
}
