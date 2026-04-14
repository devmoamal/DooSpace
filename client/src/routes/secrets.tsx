import { createFileRoute } from "@tanstack/react-router";
import { SecretsPage } from "@/pages/SecretsPage";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/secrets")({
  component: SecretsComponent,
});

function SecretsComponent() {
  return (
    <AppLayout>
      <SecretsPage />
    </AppLayout>
  );
}
