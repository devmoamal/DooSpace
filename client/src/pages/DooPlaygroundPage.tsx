import { ChevronLeft, Terminal, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useDooQuery } from "@/hooks/queries/useDoos";
import { usePlayground } from "@/hooks/usePlayground";
import { EndpointSidebar } from "@/components/playground/EndpointSidebar";
import { UrlBar } from "@/components/playground/UrlBar";
import { RequestPanel } from "@/components/playground/RequestPanel";
import { ResponsePanel } from "@/components/playground/ResponsePanel";

interface DooPlaygroundPageProps {
  id: number;
}

export function DooPlaygroundPage({ id }: DooPlaygroundPageProps) {
  const { data: doo, isLoading } = useDooQuery(id);
  const playground = usePlayground(id);

  return (
    <div className="h-full flex flex-col bg-bg overflow-hidden selection:bg-brand/30 selection:text-brand">
      {/* Header — matches app style (h-11) */}
      <header className="h-11 border-b border-border flex items-center justify-between px-5 shrink-0 bg-bg/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link
            to="/doo/$id"
            params={{ id: String(id) }}
            className="h-7 w-7 flex items-center justify-center rounded-none border border-border text-text-subtle hover:text-text hover:bg-surface/50 hover:border-brand/30 transition-all -ml-1 group"
            title="Back to Editor"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          </Link>

          <div className="w-px h-4 bg-border/50" />

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-none bg-brand/10 text-brand">
              <Terminal size={12} />
            </div>
            <div className="flex flex-col">
               <h1 className="text-[13px] font-bold text-text">Playground</h1>
               {doo?.name && (
                 <span className="text-[11px] font-mono text-text-subtle/60 leading-none">
                   {doo.name}
                 </span>
               )}
            </div>
          </div>
        </div>

        {/* Right side info */}
        {!isLoading && doo && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 opacity-60">
               <span className="text-[10px] font-bold font-mono text-text-subtle tabular-nums opacity-60">
                 {doo.endpoints?.length || 0} Endpoints
               </span>
            </div>
            <div className="h-4 w-px bg-border/50" />
            <div className="flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-none ${doo.is_active ? "bg-brand animate-pulse" : "bg-border"}`} />
               <span className="text-[10px] font-bold font-mono text-text-muted">
                 {doo.is_active ? "Online" : "Offline"}
               </span>
            </div>
          </div>
        )}
      </header>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-brand" size={24} />
        </div>
      ) : (
        <div className="flex-1 flex min-h-0 p-4 gap-4 bg-bg-alt/5">
          {/* Sidebar */}
          <div className="w-64 flex flex-col bg-bg border border-border rounded-none overflow-hidden shrink-0">
            <EndpointSidebar
              endpoints={doo?.endpoints || []}
              selectedEndpoint={playground.selectedEndpoint}
              onSelect={playground.setSelectedEndpoint}
              onMethodChange={playground.setMethod}
              onPathChange={playground.setPath}
            />
          </div>

          {/* Main area */}
          <main className="flex-1 flex flex-col min-w-0 gap-4">
            <div className="bg-bg border border-border rounded-none overflow-hidden shrink-0">
              <UrlBar
                id={id}
                method={playground.method}
                onMethodChange={playground.setMethod}
                path={playground.path}
                onPathChange={playground.setPath}
                onSend={playground.handleSend}
                isSending={playground.isSending}
              />
            </div>

            {/* Request / Response split */}
            <div className="flex-1 flex min-h-0 gap-4">
              <div className="flex-1 flex flex-col min-w-0 bg-bg border border-border rounded-none overflow-hidden">
                <RequestPanel
                  activeTab={playground.activeTab}
                  onTabChange={playground.setActiveTab}
                  pathParams={playground.pathParams}
                  params={playground.params}
                  onParamsChange={playground.setParams}
                  headers={playground.headers}
                  onHeadersChange={playground.setHeaders}
                  bodyMode={playground.bodyMode}
                  onBodyModeChange={playground.setBodyMode}
                  parsedFields={playground.parsedFields}
                  formBody={playground.formBody}
                  onFormBodyChange={playground.setFormBody}
                  kvBody={playground.kvBody}
                  onKvBodyChange={playground.setKvBody}
                  rawBody={playground.rawBody}
                  onRawBodyChange={playground.setRawBody}
                  selectedEndpoint={playground.selectedEndpoint}
                />
              </div>

              <div className="flex-1 flex flex-col min-w-0 bg-bg border border-border rounded-none overflow-hidden">
                <ResponsePanel
                  response={playground.response}
                  selectedEndpoint={playground.selectedEndpoint}
                />
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
