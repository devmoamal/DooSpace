import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/pages/SettingsPage";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/settings")({
  component: () => (
    <AppLayout>
      <SettingsPage />
    </AppLayout>
  ),
});
