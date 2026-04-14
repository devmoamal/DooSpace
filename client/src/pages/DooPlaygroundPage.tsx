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
    <div className="h-full flex flex-col bg-bg border-l border-border">
      {/* Header */}
      <header className="h-12 border-b border-border flex items-center justify-between px-4 shrink-0 bg-surface">
        <div className="flex items-center gap-3">
          <Link
            to="/doo/$id"
            params={{ id: String(id) }}
            className="p-1.5 text-text-subtle hover:text-text hover:bg-border rounded transition-colors -ml-1.5"
            title="Back to Editor"
          >
            <ChevronLeft size={16} />
          </Link>
          <div className="flex items-center justify-center w-6 h-6 rounded bg-brand/10 text-brand">
            <Terminal size={12} className="ml-0.5" />
          </div>
          <h2 className="text-[13px] font-semibold text-text">
            Playground{" "}
            <span className="text-text-subtle font-normal ml-2">Doo #{id}</span>
          </h2>
        </div>
      </header>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-text-subtle" />
        </div>
      ) : (
        <div className="flex-1 flex min-h-0">
          <EndpointSidebar
            endpoints={doo?.endpoints || []}
            selectedEndpoint={playground.selectedEndpoint}
            onSelect={playground.setSelectedEndpoint}
            onMethodChange={playground.setMethod}
            onPathChange={playground.setPath}
          />

          <main className="flex-1 flex flex-col min-w-0 bg-bg">
            <UrlBar
              id={id}
              method={playground.method}
              onMethodChange={playground.setMethod}
              path={playground.path}
              onPathChange={playground.setPath}
              onSend={playground.handleSend}
              isSending={playground.isSending}
            />

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
              />

              <ResponsePanel response={playground.response} />
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
