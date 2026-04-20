import { useState, useEffect, useRef } from "react";
import { X, Send, Bot, User, Loader2, Cpu, Terminal, Sparkles, MinusSquare, Maximize2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { settingsService } from "@/services/settings.service";
import { useSettings } from "@/hooks/queries/useSettings";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();

  const isConfigured = settings.some(s => s.key === "AI_API_KEY" && s.value);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await settingsService.chat([...messages, userMessage]);
      setMessages(prev => [...prev, { role: "assistant", content: response.content }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `ERROR: ${error.response?.data?.message || "Failed to reach intelligence agent."}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand text-white shadow-2xl flex items-center justify-center hover:scale-105 transition-all z-50 group rounded-none"
      >
        <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  return (
    <div className={cn(
      "fixed bottom-6 right-6 w-96 bg-bg border border-border shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col z-50 transition-all duration-300 rounded-none",
      isMinimized ? "h-14" : "h-[600px] max-h-[80vh]"
    )}>
      {/* Header */}
      <div className="h-14 border-b border-border bg-surface/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-none bg-brand/10 flex items-center justify-center border border-brand/20">
            <Bot size={16} className="text-brand" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-text leading-none">DooSpace Agent</span>
            <span className="text-[9px] font-mono text-brand mt-1">Autonomous Orchestrator</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 text-text-subtle hover:text-text hover:bg-surface/50 transition-colors"
          >
            {isMinimized ? <Maximize2 size={14} /> : <MinusSquare size={14} />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-text-subtle hover:text-text hover:bg-surface/50 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-bg/50">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4 text-center px-6">
                <Cpu size={32} className="text-text-muted animate-pulse" />
                <div className="space-y-1">
                  <p className="text-[11px] font-black text-text-muted">Agent Initialized</p>
                  <p className="text-[10px] font-mono leading-relaxed">
                    {!isConfigured 
                      ? "AI configuration missing. Please update keys in Settings." 
                      : "Awaiting instructions. I can help you create Doos, manage Loops, and orchestrate logic."}
                  </p>
                </div>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className={cn(
                "flex flex-col gap-2 max-w-[85%]",
                m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              )}>
                <div className={cn(
                  "p-3 text-[12px] leading-relaxed shadow-sm",
                  m.role === "user" 
                    ? "bg-brand text-white border border-brand/20" 
                    : "bg-surface border border-border text-text"
                )}>
                  {m.content}
                </div>
                <div className="flex items-center gap-1.5 opacity-40 px-1">
                  {m.role === "assistant" ? <Bot size={10} /> : <User size={10} />}
                  <span className="text-[9px] font-black">
                    {m.role === "assistant" ? "AGENT_OUTPUT" : "USER_CMD"}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex flex-col gap-2 mr-auto items-start max-w-[85%] animate-in fade-in">
                <div className="p-3 bg-surface border border-border text-text relative min-w-[60px] h-10 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-brand/5 animate-pulse" />
                  <Loader2 size={16} className="animate-spin text-brand" />
                </div>
                <div className="flex items-center gap-1.5 opacity-40 px-1">
                  <Terminal size={10} />
                  <span className="text-[9px] font-black animate-pulse">Processing_Trace...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-surface/50">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <Input
                placeholder={isConfigured ? "SEND INSTRUCTION..." : "AGENT OFFLINE..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading || !isConfigured}
                className="rounded-none border-border bg-bg h-10 text-[12px] font-mono tracking-tight shadow-inner"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !isConfigured || !inputText.trim()}
                className="w-10 h-10 shrink-0 p-0 flex items-center justify-center rounded-none shadow-lg"
              >
                <Send size={16} />
              </Button>
            </form>
            {!isConfigured && (
              <p className="mt-2 text-[8px] font-black text-red-500 text-center">
                Critical: Intelligence configuration required.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
