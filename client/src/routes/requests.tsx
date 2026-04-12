import { createFileRoute } from "@tanstack/react-router";
import { RequestsPage } from "@/pages";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/requests")({
  component: RequestsComponent,
});

function RequestsComponent() {
  return (
    <AppLayout>
      <RequestsPage />
    </AppLayout>
  );
}
