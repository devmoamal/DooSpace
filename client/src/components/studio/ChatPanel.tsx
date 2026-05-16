import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Cpu, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { type PageMessage } from "@doospace/shared";
import { usePages } from "@/hooks/queries/usePages";

interface ChatPanelProps {
  pageId: string;
  messages: PageMessage[];
  isLoading?: boolean;
}

export function ChatPanel({ pageId, messages, isLoading: isPageLoading }: ChatPanelProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { usePageChat } = usePages();
  const chatMutation = usePageChat(pageId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatMutation.isPending]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || chatMutation.isPending) return;

    const text = inputText;
    setInputText("");
    
    try {
      await chatMutation.mutateAsync(text);
    } catch (error) {
      console.error("Chat Error:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg border-r border-border w-[420px] shrink-0 overflow-hidden relative z-20">
      {/* Header - Subtle & Integrated */}
      <div className="h-12 px-6 flex items-center justify-between shrink-0 bg-bg/50 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand/5 border border-brand/20">
            <Sparkles size={12} className="text-brand" />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-text tracking-tight uppercase">AI Architect</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 opacity-60">
           <div className="w-1 h-1 rounded-full bg-brand animate-pulse" />
           <span className="text-[9px] font-mono font-bold text-brand uppercase tracking-widest">Active</span>
        </div>
      </div>

      {/* Messages Area - More White Space, Cleaner typography */}
      <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar pb-32">
        {messages.length === 0 && !isPageLoading && (
          <div className="h-full flex flex-col items-center justify-center py-10">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center mb-6 shadow-sm">
              <Cpu size={24} className="text-brand/50" />
            </div>
            <div className="text-center space-y-2 px-6">
              <h3 className="text-[14px] font-bold text-text tracking-tight">V0_ARCHITECT_INITIALIZED</h3>
              <p className="text-[12px] text-text-muted leading-relaxed max-w-[280px] mx-auto">
                Manifest your interface. Describe columns, sections, or logic, and I'll generate the code.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-2 w-full max-w-[300px] mt-8">
               {[
                 "Create a modern landing page for a SaaS",
                 "Build a high-fidelity dashboard layout",
                 "Add a responsive side navigation"
               ].map(t => (
                 <button 
                  key={t}
                  onClick={() => setInputText(t)}
                  className="group flex items-center justify-between text-[11px] p-3 bg-surface border border-border hover:border-brand/40 transition-all text-left text-text-muted hover:text-text rounded-none"
                 >
                   <span className="truncate">{t}</span>
                   <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                 </button>
               ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className="group animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                "w-5 h-5 rounded-md flex items-center justify-center border",
                m.role === "user" ? "bg-text/5 border-border" : "bg-brand/10 border-brand/20"
              )}>
                {m.role === "user" ? <User size={10} className="text-text-muted" /> : <Bot size={10} className="text-brand" />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">
                {m.role === "user" ? "Lead Designer" : "Architect"}
              </span>
            </div>
            
            <div className={cn(
              "text-[13px] leading-relaxed pl-7",
              m.role === "user" ? "text-text" : "text-text-muted border-l border-brand/20 ml-2.5 pl-4"
            )}>
              {m.content}
            </div>
          </div>
        ))}

        {chatMutation.isPending && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md flex items-center justify-center border bg-brand/10 border-brand/20">
                <Loader2 size={10} className="text-brand animate-spin" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand animate-pulse">
                Thinking...
              </span>
            </div>
            <div className="h-4 pl-7 flex gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand/20 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-px" />
      </div>

      {/* Floating Input Area - Glassmorphism, Premium look */}
      <div className="absolute bottom-6 left-6 right-6 z-30">
        <div className="relative group">
          {/* Subtle glow effect */}
          <div className="absolute -inset-1 bg-linear-to-r from-brand to-brand-dark rounded-xl opacity-0 group-focus-within:opacity-10 blur-xl transition duration-500"></div>
          
          <form 
            onSubmit={handleSend}
            className="relative flex flex-col bg-surface/80 backdrop-blur-2xl border border-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden"
          >
            <textarea
              placeholder="Manifest your design..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={chatMutation.isPending}
              rows={1}
              className="w-full bg-transparent border-none focus:ring-0 px-6 py-5 text-[13px] resize-none max-h-32 min-h-[64px] custom-scrollbar placeholder:text-text-subtle/40 leading-relaxed"
            />
            
            <div className="flex items-center justify-between px-6 pb-4">
              <div className="flex items-center gap-4 opacity-40">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full border border-text/20" />
                  <span className="text-[10px] font-mono font-medium tracking-tight">Shift + Enter for multiline</span>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={chatMutation.isPending || !inputText.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-text text-bg hover:opacity-90 disabled:opacity-20 transition-all font-bold text-[11px] uppercase tracking-widest"
              >
                {chatMutation.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    <span>Execute</span>
                    <Send size={12} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        <p className="mt-4 text-center text-[9px] text-text-muted font-mono uppercase tracking-[0.2em] opacity-30">
          Neural Architecture Engine v4.0.0
        </p>
      </div>
    </div>
  );
}
