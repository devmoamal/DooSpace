import { createRootRoute, Outlet } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen w-full bg-bg text-text selection:bg-brand selection:text-white transition-colors duration-300 font-sans flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}
