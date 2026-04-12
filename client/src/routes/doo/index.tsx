import { createFileRoute } from "@tanstack/react-router";
import { DoosPage } from "@/pages";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/doo/")({
  component: () => (
    <AppLayout>
      <DoosPage />
    </AppLayout>
  ),
});
