import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authService } from "@/services/auth.service";
import { Box, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

import { ThemeToggle } from "@/components/layout/ThemeToggle";

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
      if ((res as any).ok) navigate({ to: "/doo" });
    } catch (err: any) {
      setError(err?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Top bar */}
      <div className="h-11 flex items-center justify-between px-5 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Box size={16} className="text-brand" />
          <span className="font-semibold text-[13px] text-text">DooSpace</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Form centered */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[320px] space-y-6">
          <div>
            <h1 className="text-[15px] font-semibold text-text">Sign in</h1>
            <p className="text-[12px] text-text-muted mt-0.5">
              Access your orchestration workspace
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <p className="px-3 py-2 border border-red-500/20 rounded text-[11px] font-mono text-red-500 bg-red-500/5">
                {error}
              </p>
            )}

            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your username"
              required
              autoFocus
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              className={cn("w-full h-9 gap-2", loading && "opacity-50")}
              disabled={loading}
            >
              {loading ? "Signing in…" : "Continue"}
              {!loading && <ArrowRight size={13} />}
            </Button>
          </form>

          <p className="text-[10px] text-text-subtle text-center font-mono">
            DooSpace v1.0
          </p>
        </div>
      </div>
    </div>
  );
};
