import { createFileRoute } from "@tanstack/react-router";
import { DooBoxPage } from "@/pages/DooBoxPage";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/doobox")({
  component: DooBoxComponent,
});

function DooBoxComponent() {
  return (
    <AppLayout>
      <DooBoxPage />
    </AppLayout>
  );
}
