import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/layout/Navbar";
import { useAuthStore } from "@/stores/auth.store";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden relative w-full">
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto flex flex-col justify-center max-w-6xl mx-auto w-full px-6 relative z-10">
        <section className="relative space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-text leading-tight">
            Orchestration,{" "}
            <span className="text-brand opacity-80">
              refined.
            </span>
          </h1>
  
          <p className="text-xl text-text/40 font-medium max-w-lg mx-auto">
            Deploy logic and monitor states with high-fidelity minimalist tooling.
          </p>
        </section>
      </main>
    </div>
  );
}
