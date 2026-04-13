import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/stores/theme.store";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 rounded text-text-muted hover:text-text hover:bg-surface-lighter transition-colors cursor-pointer"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      aria-label="Toggle theme"
    >
      {theme === "light"
        ? <Moon size={15} />
        : <Sun size={15} />
      }
    </button>
  );
}
