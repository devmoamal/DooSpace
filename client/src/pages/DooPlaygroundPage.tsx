import { ChevronLeft, Terminal, Loader2, Info } from "lucide-react";
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
    <div className="flex-1 flex flex-col h-full bg-bg overflow-hidden">
      {/* Standard Header */}
      <header className="h-11 border-b border-border flex items-center justify-between px-5 bg-bg/80 backdrop-blur-md sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/doo/$id"
            params={{ id: String(id) }}
            className="h-7 w-7 flex items-center justify-center rounded-none border border-border text-text-subtle hover:text-text hover:bg-surface transition-all -ml-1"
            title="Back to Editor"
          >
            <ChevronLeft size={14} />
          </Link>

          <div className="w-px h-4 bg-border/50" />

          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-6 h-6 rounded-none bg-brand/10 text-brand">
              <Terminal size={12} />
            </div>
            <h1 className="text-[13px] font-bold text-text">Playground</h1>
            {doo?.name && (
              <span className="text-[11px] font-mono text-text-subtle/60 truncate max-w-[200px]">
                / {doo.name}
              </span>
            )}
          </div>
        </div>

        {!isLoading && doo && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-none ${doo.is_active ? "bg-brand animate-pulse" : "bg-border"}`} />
               <span className="text-[10px] font-bold font-mono text-text-muted">
                 {doo.is_active ? "Active" : "Inactive"}
               </span>
            </div>
          </div>
        )}
      </header>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-brand" size={20} />
        </div>
      ) : (
        <div className="flex-1 flex min-h-0 bg-bg">
          {/* Sidebar - more integrated */}
          <div className="w-64 border-r border-border flex flex-col shrink-0 bg-surface/20">
            <EndpointSidebar
              endpoints={doo?.endpoints || []}
              selectedEndpoint={playground.selectedEndpoint}
              onSelect={playground.setSelectedEndpoint}
              onMethodChange={playground.setMethod}
              onPathChange={playground.setPath}
            />
          </div>

          {/* Main area - standard padding and layout */}
          <main className="flex-1 flex flex-col min-w-0">
             {/* URL Bar - no extra border radius, integrated */}
            <div className="border-b border-border shrink-0">
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

            {/* Split Panel */}
            <div className="flex-1 flex min-h-0">
              <div className="flex-1 flex flex-col min-w-0 border-r border-border">
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

              <div className="flex-1 flex flex-col min-w-0 bg-bg">
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
