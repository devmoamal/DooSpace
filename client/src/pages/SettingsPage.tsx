import { AISettings } from "@/components/settings/AISettings";
import { Settings as SettingsIcon, Brain } from "lucide-react";

export function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col h-full bg-bg overflow-hidden">
      {/* Standard Header */}
      <header className="h-11 border-b border-border flex items-center justify-between px-5 bg-bg/80 backdrop-blur-md sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-6 h-6 rounded-none bg-brand/10 text-brand">
            <SettingsIcon size={12} />
          </div>
          <h1 className="text-[13px] font-bold text-text">Settings</h1>
        </div>
      </header>

      {/* Standard Content Area */}
      <main className="flex-1 px-5 py-8 overflow-y-auto custom-scrollbar flex flex-col min-h-0">
        <div className="max-w-3xl space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <section className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Brain size={18} className="text-brand/60" />
                <h2 className="text-[15px] font-bold text-text">Agent Orchestrator</h2>
              </div>
              <p className="text-[11px] font-mono text-text-subtle leading-relaxed max-w-xl">
                Configure the underlying LLM engines used by the autonomous DooSpace Agent. This enables tool-calling, script discovery, and workspace management via natural language.
              </p>
            </div>
            
            <div className="bg-bg border border-border p-6 shadow-sm relative group">
              <AISettings />
            </div>
          </section>

          <section className="space-y-4 opacity-50 pointer-events-none grayscale">
            <div className="space-y-1">
               <h2 className="text-[14px] font-bold text-text">Appearance (Coming Soon)</h2>
               <p className="text-[10px] font-mono text-text-subtle">Customize the workspace theme and UI density.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
