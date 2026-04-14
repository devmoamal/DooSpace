import { createFileRoute } from "@tanstack/react-router";
import { DooPlaygroundPage } from "@/pages";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/doo/$id_/playground")({
  component: DooPlaygroundRoute,
});

function DooPlaygroundRoute() {
  const { id } = Route.useParams();
  return (
    <AppLayout hideSidebar>
      <DooPlaygroundPage id={parseInt(id, 10)} />
    </AppLayout>
  );
}
