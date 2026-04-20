import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/layout/Navbar";
import { useAuthStore } from "@/stores/auth.store";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Box } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/Badge";

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
    <div className="flex flex-col h-screen overflow-hidden relative w-full bg-bg selection:bg-brand/30 selection:text-brand">
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-y-auto flex flex-col justify-center relative">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none overflow-hidden select-none">
           <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(var(--brand) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <section className="space-y-8 text-center max-w-3xl mx-auto w-full px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Hero Header */}
          <div className="space-y-4">
             <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-none bg-brand/10 flex items-center justify-center">
                   <Box size={20} className="text-brand" />
                </div>
                <Badge variant="neutral" size="sm" className="font-bold opacity-40 rounded-none">V1.0.0-ALPHA</Badge>
             </div>
             
            <h1 className="text-5xl md:text-7xl font-black tracking-[-0.04em] text-text leading-[0.9] italic">
              Orchestration, <br />
              <span className="text-brand not-italic">Refined.</span>
            </h1>

            <p className="text-[16px] text-text-subtle max-w-lg mx-auto leading-relaxed font-medium">
              Deploy logic units, manage persistent states, and monitor 
              distributed traces with high-fidelity minimalist infrastructure.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-center gap-4 pt-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="primary" className="gap-3 px-8 h-12 rounded-none font-black group shadow-xl shadow-brand/10">
                  Access Workspace
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="primary" className="gap-3 px-8 h-12 rounded-none font-black group shadow-xl shadow-brand/10">
                    Get Started
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                 <Button variant="secondary" className="px-8 h-12 rounded-none font-bold border-border/50">
                    Docs
                 </Button>
              </div>
            )}
          </div>

          {/* Architecture Metrics */}
          <div className="flex items-center justify-center gap-12 pt-12">
            {[
              { label: "Deployment", value: "QUICKER" },
              { label: "Persistence", value: "KV+SQL" },
              { label: "Telemetry", value: "DOOPIX" },
            ].map((m) => (
              <div key={m.label} className="text-left group cursor-default">
                <p className="text-[18px] font-black text-text italic leading-none group-hover:text-brand transition-colors">
                  {m.value}
                </p>
                <p className="text-[10px] font-bold text-text-subtle mt-1.5 opacity-50">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Persistent Status Bar */}
      <footer className="h-11 border-t border-border flex items-center justify-between px-6 shrink-0 bg-bg/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5 px-2 py-0.5 border border-brand/20 bg-brand/5">
              <div className="w-1.5 h-1.5 bg-brand animate-pulse" />
              <span className="text-[9px] font-bold text-brand">Node-01 Active</span>
           </div>
           <span className="text-[10px] font-bold text-text-subtle opacity-40">
             © 2026 DooSpace Infrastructure
           </span>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-[10px] font-mono text-text-subtle opacity-40 tabular-nums">
             Latency: 14ms
           </span>
        </div>
      </footer>
    </div>
  );
}
