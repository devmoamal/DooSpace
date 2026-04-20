import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { AISettings } from "@/components/settings/AISettings";
import { Settings as SettingsIcon, Brain, Sliders, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/cn";

export function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-bg selection:bg-brand/30 selection:text-brand">
      {/* App-Style Header */}
      <header className="h-11 border-b border-border flex items-center justify-between px-5 shrink-0 bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-none bg-brand/10 border border-brand/20 text-brand">
            <SettingsIcon size={14} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[13px] font-bold text-text">Settings</h1>
          </div>
        </div>
        

      </header>

      {/* High-Fidelity Settings Layout */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative p-0">
        <div className="flex h-full">
            {/* Inner Sidebar for Settings Categories */}
            <div className="w-64 border-r border-border bg-surface/30 shrink-0 hidden md:flex flex-col py-6 px-4 space-y-1">

                {[
                    { id: 'ai', label: 'Intelligence & Agency', icon: Brain, active: true },
                    { id: 'general', label: 'Appearance', icon: Sliders },
                    { id: 'security', label: 'Access Control', icon: Shield },
                ].map((item) => (
                    <button 
                        key={item.id}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold transition-all text-left",
                            item.active 
                                ? "bg-surface border border-border text-text shadow-sm" 
                                : "text-text-subtle hover:bg-surface/50 hover:text-text cursor-not-allowed opacity-50"
                        )}
                    >
                        <item.icon size={13} className={item.active ? "text-brand" : ""} />
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Main Settings Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-bg p-8 md:p-12">
                <div className="max-w-3xl space-y-12">
                    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="space-y-2">
                             <div className="flex items-center gap-3">
                                <Brain size={20} className="text-brand/60" />
                                <h2 className="text-[16px] font-bold text-text italic">Agent Orchestrator</h2>
                             </div>
                             <p className="text-[11px] font-mono text-text-subtle leading-relaxed max-w-xl">
                                Configure the underlying LLM engines used by the autonomous DooSpace Agent. This enables tool-calling, script discovery, and workspace management via natural language.
                             </p>
                        </div>
                        
                        <div className="bg-bg border border-border p-8 shadow-xl shadow-black/5 relative group">
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-brand/20 group-hover:border-brand/50 transition-colors" />
                            
                            <AISettings />
                        </div>
                    </section>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
