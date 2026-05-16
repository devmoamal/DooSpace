import { createFileRoute } from "@tanstack/react-router";
import { PagesPage } from "@/pages";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/pages/")({
  component: () => (
    <AppLayout>
      <PagesPage />
    </AppLayout>
  ),
});
