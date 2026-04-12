import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/doo")({
  component: DooLayout,
});

function DooLayout() {
  return <Outlet />;
}
