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
    <div className="h-full flex flex-col bg-bg overflow-hidden">
      {/* Header — matches app style (h-11) */}
      <header className="h-11 border-b border-border flex items-center justify-between px-5 shrink-0 bg-bg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link
            to="/doo/$id"
            params={{ id: String(id) }}
            className="h-6 w-6 flex items-center justify-center rounded border border-border text-text-subtle hover:text-text hover:bg-surface transition-colors -ml-1"
            title="Back to Editor"
          >
            <ChevronLeft size={13} />
          </Link>

          <div className="w-px h-4 bg-border" />

          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-5 h-5 rounded bg-brand/10 text-brand">
              <Terminal size={11} />
            </div>
            <h1 className="text-[13px] font-semibold text-text">
              Playground
            </h1>
            {doo?.name && (
              <span className="text-[12px] text-text-muted font-normal">
                · {doo.name}
              </span>
            )}
          </div>
        </div>

        {/* Right side info */}
        {!isLoading && doo && (
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-text-subtle tabular-nums">
              {(doo.endpoints || []).length} endpoint
              {(doo.endpoints || []).length !== 1 ? "s" : ""}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${doo.is_active ? "bg-brand" : "bg-border"}`}
            />
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
              {doo.is_active ? "active" : "inactive"}
            </span>
          </div>
        )}
      </header>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-text-subtle" size={18} />
        </div>
      ) : (
        <div className="flex-1 flex min-h-0">
          {/* Sidebar */}
          <EndpointSidebar
            endpoints={doo?.endpoints || []}
            selectedEndpoint={playground.selectedEndpoint}
            onSelect={playground.setSelectedEndpoint}
            onMethodChange={playground.setMethod}
            onPathChange={playground.setPath}
          />

          {/* Main area */}
          <main className="flex-1 flex flex-col min-w-0">
            <UrlBar
              id={id}
              method={playground.method}
              onMethodChange={playground.setMethod}
              path={playground.path}
              onPathChange={playground.setPath}
              onSend={playground.handleSend}
              isSending={playground.isSending}
            />

            {/* Request / Response split */}
            <div className="flex-1 flex min-h-0">
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

              <ResponsePanel
                response={playground.response}
                selectedEndpoint={playground.selectedEndpoint}
              />
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
