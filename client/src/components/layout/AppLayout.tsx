import { Toaster } from "sonner";
import { Sidebar } from "./Sidebar";
import { useThemeStore } from "@/stores/theme.store";
import { useEffect } from "react";

export function AppLayout({
  children,
  hideSidebar = false
}: {
  children: React.ReactNode;
  hideSidebar?: boolean;
}) {
  const { theme } = useThemeStore();

  // Sync theme class on mount
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="flex h-screen bg-bg overflow-hidden w-full text-text font-sans">
      <Toaster
        position="bottom-right"
        richColors
        theme={theme}
        toastOptions={{
          style: {
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }
        }}
      />
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-bg">
        {children}
      </main>
    </div>
  );
}
