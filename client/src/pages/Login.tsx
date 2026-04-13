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
      if ((res as any).ok) navigate({ to: "/doo" });
    } catch (err: any) {
      setError(err?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[340px] space-y-7">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Box size={18} className="text-brand" />
          <span className="font-semibold text-[14px] text-text">DooSpace</span>
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-[15px] font-semibold text-text">Sign in</h1>
          <p className="text-[12px] text-text-muted mt-0.5">
            Access your orchestration workspace
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <p className="text-[11px] font-mono text-red-500 border border-red-500/20 rounded px-3 py-2 bg-red-500/5">
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
            className={cn("w-full h-9", loading && "opacity-50 cursor-not-allowed")}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
};
