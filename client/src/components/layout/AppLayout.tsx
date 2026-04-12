import { Toaster } from "sonner";
import { Sidebar } from "./Sidebar";

export function AppLayout({ 
  children, 
  hideSidebar = false 
}: { 
  children: React.ReactNode;
  hideSidebar?: boolean;
}) {
  return (
    <div className="flex h-screen bg-bg transition-colors duration-300 overflow-hidden w-full text-text font-sans selection:bg-brand selection:text-surface">
      <Toaster theme="dark" position="bottom-right" richColors />
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-bg">
        {children}
      </main>
    </div>
  );
}
