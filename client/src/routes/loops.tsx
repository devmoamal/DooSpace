import { createFileRoute } from "@tanstack/react-router";
import { LoopsPage } from "@/pages/LoopsPage";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/loops")({
  component: LoopsComponent,
});

function LoopsComponent() {
  return (
    <AppLayout>
      <LoopsPage />
    </AppLayout>
  );
}
