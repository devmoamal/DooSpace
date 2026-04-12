import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authService } from "@/services/auth.service";
import { Box } from "lucide-react";
import { cn } from "@/lib/cn";

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await authService.login({ username, password });
      if ((res as any).ok) {
        navigate({ to: "/doo" });
      }
    } catch (err: any) {
      setError(err?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background decoration - subtle emerald glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-3 bg-brand/5 border border-brand/20 rounded-xl text-brand transition-all hover:scale-105 duration-300">
              <Box size={32} />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-text">
              Welcome to DooSpace
            </h1>
            <p className="text-sm text-text-muted font-medium">
              Identify yourself to access the orchestrator.
            </p>
          </div>
        </header>

        <div className="bg-surface/50 border border-border p-8 rounded-xl shadow-2xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-[11px] font-bold text-center uppercase tracking-widest animate-in fade-in zoom-in-95">
                {error}
              </div>
            )}

            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin_Doo"
              required
              className="bg-bg"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-bg"
            />

            <div className="pt-2">
              <Button
                type="submit"
                className={cn(
                  "w-full h-10 rounded-md text-sm font-bold bg-brand text-bg hover:bg-brand/90 transition-all active:scale-[0.98] shadow-lg shadow-brand/10",
                  loading && "opacity-50 cursor-not-allowed",
                )}
                disabled={loading}
              >
                {loading ? "AUTHENTICATING..." : "SIGN IN"}
              </Button>
            </div>
          </form>

          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-bg px-2 text-text-muted/40 font-bold tracking-widest">
                or
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-10 text-xs font-bold gap-3 uppercase tracking-widest text-text-muted/60 hover:text-text"
          >
            Request Access
          </Button>
        </div>

        <footer className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted/20">
          Orchestration Doo Management
        </footer>
      </div>
    </div>
  );
};
