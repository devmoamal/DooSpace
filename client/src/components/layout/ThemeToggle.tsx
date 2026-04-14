import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/stores/theme.store";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-8 h-8 rounded flex items-center justify-center text-text-muted hover:text-text hover:bg-surface transition-colors cursor-pointer",
        className
      )}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-label="Toggle theme"
    >
      <Sun
        size={14}
        className={cn(
          "absolute transition-all duration-200",
          isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-75"
        )}
      />
      <Moon
        size={14}
        className={cn(
          "absolute transition-all duration-200",
          isDark
            ? "opacity-0 rotate-90 scale-75"
            : "opacity-100 rotate-0 scale-100"
        )}
      />
    </button>
  );
}
