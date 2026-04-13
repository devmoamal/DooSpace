import { X, Clock, Terminal, Activity, FileJson, Layers, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

interface RequestDetailsDrawerProps {
  request: any | null;
  onClose: () => void;
  getDooName: (id: number) => string;
}

export function RequestDetailsDrawer({ request, onClose, getDooName }: RequestDetailsDrawerProps) {
  if (!request) return null;

  const isSuccess = request.status < 400;

  return (
    <>
      <div 
        className="fixed inset-0 bg-bg/40 backdrop-blur-[2px] z-100 animate-in fade-in duration-300" 
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-[500px] bg-bg border-l border-border shadow-2xl z-101 flex flex-col animate-in slide-in-from-right duration-400 ease-out">
        <header className="h-16 flex items-center justify-between px-8 border-b border-border bg-surface/30 shrink-0">
          <div className="flex items-center gap-3">
             <div className={cn(
               "w-2 h-2 rounded-full",
               isSuccess ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
             )} />
             <h2 className="text-[12px] font-bold text-text uppercase tracking-widest">
               Runtime Perspective
             </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text hover:bg-surface rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
          {/* Metadata Card */}
          <section className="p-6 bg-surface border border-border rounded-2xl space-y-6 shadow-sm">
             <div className="flex items-start justify-between">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-60">Source Unit</p>
                   <h3 className="text-xl font-bold text-text tracking-tight flex items-center gap-2">
                      {getDooName(request.doo_id)}
                      <ExternalLink size={14} className="text-text-muted" />
                   </h3>
                </div>
                <div className="bg-bg border border-border rounded-lg px-2 py-1 flex items-center gap-2">
                   <span className="text-[10px] font-black uppercase text-brand font-mono">{request.method}</span>
                   <div className="w-px h-2 bg-border" />
                   <span className={cn("text-[10px] font-bold font-mono", isSuccess ? "text-emerald-500" : "text-red-500")}>
                      {request.status}
                   </span>
                </div>
             </div>

             <div className="space-y-2">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-60">Interface Reference</p>
                <div className="p-3 bg-bg border border-border rounded-xl font-mono text-[12px] text-text font-bold break-all">
                   {request.path}
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-60">
                      <Clock size={12} />
                      Latency
                   </div>
                   <p className="text-lg font-mono font-bold text-text">{request.duration || 0} MS</p>
                </div>
                <div className="space-y-1">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-60">
                      <Terminal size={12} />
                      Context
                   </div>
                   <p className="text-lg font-mono font-bold text-text">DOO_{request.doo_id}</p>
                </div>
             </div>
          </section>

          {/* DooPix Mosaic Chip */}
          {request.doo_pix && request.doo_pix.length > 0 && (
            <section className="space-y-4">
               <div className="flex items-center gap-2 px-1">
                  <Layers size={14} className="text-brand" />
                  <p className="text-[11px] font-bold text-text uppercase tracking-widest">DooPix Logical Signature</p>
               </div>
               <div className="bg-surface p-4 border border-border rounded-2xl flex items-center justify-center shadow-sm">
                  <div className="grid grid-cols-24 bg-border/20 rounded-[2px] overflow-hidden p-px">
                    {request.doo_pix.map((row: string[], y: number) => 
                      row.map((color: string, x: number) => (
                        <div 
                          key={`${x}-${y}`} 
                          className="w-[10px] h-[10px] transition-transform hover:scale-125"
                          style={{ backgroundColor: color || '#171717' }}
                        />
                      ))
                    )}
                  </div>
               </div>
            </section>
          )}

          {/* Trace Logs Terminal */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 px-1">
                <Activity size={14} className="text-text-muted" />
                <p className="text-[11px] font-bold text-text uppercase tracking-widest">Execution Trace</p>
             </div>
             <div className="bg-bg border border-border shadow-inner rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-surface/50 border-b border-border flex items-center justify-between">
                   <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Standard Output</span>
                   <span className="text-[10px] font-mono text-text-muted">LINES: {request.logs?.length || 0}</span>
                </div>
                <div className="p-4 font-mono text-[11px] space-y-1.5 leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar">
                   {request.logs && request.logs.length > 0 ? (
                     request.logs.map((log: string, idx: number) => (
                       <div key={idx} className="flex gap-4 group">
                          <span className="text-text-muted/30 shrink-0 w-6 text-right select-none font-bold">{(idx + 1)}</span>
                          <span className="text-text/80 group-hover:text-text transition-colors">{log}</span>
                       </div>
                     ))
                   ) : (
                     <p className="text-text-muted/40 italic py-4 text-center uppercase tracking-widest text-[9px]">Empty Trace</p>
                   )}
                </div>
             </div>
          </section>

          {/* Response Payload */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 px-1">
                <FileJson size={14} className="text-text-muted" />
                <p className="text-[11px] font-bold text-text uppercase tracking-widest">Response Object</p>
             </div>
             <div className="bg-bg border border-border rounded-xl p-5 shadow-inner">
                {request.response ? (
                   <pre className="text-emerald-500 font-mono text-[12px] font-bold whitespace-pre-wrap leading-relaxed break-all">
                      {request.response}
                   </pre>
                ) : (
                   <p className="text-text-muted/40 italic text-center py-4 uppercase tracking-widest text-[9px]">Null Result</p>
                )}
             </div>
          </section>
        </div>

        <footer className="h-16 border-t border-border bg-surface/30 flex items-center justify-end px-8 shrink-0">
           <Button variant="secondary" size="sm" onClick={onClose} className="px-8 font-bold">
              Dismiss Details
           </Button>
        </footer>
      </div>
    </>
  );
}
