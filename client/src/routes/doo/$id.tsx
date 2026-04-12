import { createFileRoute } from "@tanstack/react-router";
import { DooEditorPage } from "@/pages";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/doo/$id")({
  component: DooEditorComponent,
});

function DooEditorComponent() {
  const { id } = Route.useParams();
  return (
    <AppLayout hideSidebar>
      <DooEditorPage id={parseInt(id, 10)} />
    </AppLayout>
  );
}
