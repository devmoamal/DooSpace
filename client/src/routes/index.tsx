import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/layout/Navbar";
import { useAuthStore } from "@/stores/auth.store";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Box } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")(({
  component: IndexComponent,
}));

function IndexComponent() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden relative w-full bg-bg">
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-y-auto flex flex-col justify-center max-w-2xl mx-auto w-full px-6">
        <section className="space-y-6 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <Box size={28} className="text-brand" />
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-text leading-tight">
            Orchestration,{" "}
            <span className="text-brand">refined.</span>
          </h1>

          <p className="text-[15px] text-text-muted max-w-md mx-auto leading-relaxed">
            Deploy logic, manage data, and monitor states with
            high-fidelity minimalist tooling.
          </p>

          {/* CTA */}
          <div className="flex items-center justify-center gap-3 pt-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button className="gap-2 px-6">
                  Open Dashboard
                  <ArrowRight size={14} />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="gap-2 px-6">
                  Get Started
                  <ArrowRight size={14} />
                </Button>
              </Link>
            )}
          </div>

          {/* Metrics bar */}
          <div className="flex items-center justify-center gap-8 pt-8">
            {[
              { label: "Deploy time", value: "<2s" },
              { label: "Storage", value: "KV+SQL" },
              { label: "Observability", value: "DooPix" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-[14px] font-mono font-semibold text-text tabular-nums">
                  {m.value}
                </p>
                <p className="text-[10px] text-text-subtle uppercase tracking-widest mt-0.5">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="h-10 border-t border-border flex items-center justify-center px-5 shrink-0">
        <span className="text-[10px] font-mono text-text-subtle">
          DooSpace — orchestration workspace
        </span>
      </footer>
    </div>
  );
}
