import { createFileRoute } from "@tanstack/react-router";
import { StoragePage } from "@/pages/StoragePage";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/storage")({
  component: StorageComponent,
});

function StorageComponent() {
  return (
    <AppLayout>
      <StoragePage />
    </AppLayout>
  );
}
