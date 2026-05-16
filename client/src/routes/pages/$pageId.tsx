import { createFileRoute } from "@tanstack/react-router";
import { PageStudio } from "@/pages";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/pages/$pageId")({
  component: () => (
    <AppLayout hideSidebar>
      <PageStudio />
    </AppLayout>
  ),
});
