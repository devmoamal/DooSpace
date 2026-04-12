import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/stores/theme.store";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 rounded-md hover:bg-surface-lighter transition-all group border border-transparent hover:border-border flex items-center justify-center text-text-muted hover:text-text"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon
          size={18}
          className="transition-transform group-hover:rotate-12"
        />
      ) : (
        <Sun size={18} className="transition-transform group-hover:scale-110" />
      )}
    </button>
  );
}
