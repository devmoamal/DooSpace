import { useState, useEffect } from "react";
import { useSettings, useAIProviders, useAIModels } from "@/hooks/queries/useSettings";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/Select";
import { Key, Globe, Cpu, Save, Loader2, Sparkles, RefreshCw } from "lucide-react";

export function AISettings() {
  const { settings, updateSetting, isUpdating } = useSettings();
  const { data: providers } = useAIProviders();
  
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [baseUrl, setBaseUrl] = useState("");

  const { data: models, isLoading: isLoadingModels, refetch: refetchModels } = useAIModels(selectedProvider);

  useEffect(() => {
    if (settings.length > 0) {
      const p = settings.find(s => s.key === "AI_PROVIDER")?.value || "";
      const k = settings.find(s => s.key === "AI_API_KEY")?.value || "";
      const m = settings.find(s => s.key === "AI_MODEL")?.value || "";
      const b = settings.find(s => s.key === "AI_BASE_URL")?.value || "";

      setSelectedProvider(p || null);
      setApiKey(k);
      setSelectedModel(m);
      setBaseUrl(b);
    }
  }, [settings]);

  const handleSave = async () => {
    if (selectedProvider) await updateSetting({ key: "AI_PROVIDER", value: selectedProvider });
    await updateSetting({ key: "AI_API_KEY", value: apiKey });
    await updateSetting({ key: "AI_MODEL", value: selectedModel });
    if (baseUrl) await updateSetting({ key: "AI_BASE_URL", value: baseUrl });
    
    // After saving keys, try to fetch models if they are not loaded
    if (selectedProvider) refetchModels();
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-brand" />
            <h3 className="text-[14px] font-black text-text">Model Engine Configuration</h3>
        </div>
        <p className="text-[11px] text-text-subtle font-mono opacity-60">
          Connect your preferred intelligence provider to power the DooSpace Agent.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Provider */}
        <div className="grid gap-2 outline-none">
          <label className="text-[10px] font-black text-text-muted flex items-center gap-2">
            <Globe size={11} className="text-brand/40" />
            Cloud Provider
          </label>
          <Select value={selectedProvider || ""} onValueChange={(v) => setSelectedProvider(v)}>
            <SelectTrigger className="rounded-none border-border bg-bg/50 h-10 text-[10px] font-black">
              <SelectValue placeholder="SELECT INTELLIGENCE SOURCE" />
            </SelectTrigger>
            <SelectContent>
              {providers?.map((p: any) => (
                <SelectItem key={p.id} value={p.id} className=" text-[10px] font-black rounded-none">
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* API Key */}
        <div className="grid gap-2">
          <label className="text-[10px] font-black text-text-muted flex items-center gap-2">
            <Key size={11} className="text-brand/40" />
            Authentication Token
          </label>
          <Input
            type="password"
            placeholder="Enter API access key..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="rounded-none border-border bg-bg/50 h-10 font-mono text-[11px]"
          />
        </div>

        {/* Custom Base URL (if custom) */}
        {selectedProvider === "custom" && (
          <div className="grid gap-2">
            <label className="text-[10px] font-black text-text-muted flex items-center gap-2">
              <Globe size={11} className="text-brand/40" />
              API Entry Point (Base URL)
            </label>
            <Input
              placeholder="HTTPS://API.EXAMPLE.COM/V1"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="rounded-none border-border bg-bg/50 h-10 font-mono text-[11px]"
            />
          </div>
        )}

        {/* Model */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-text-muted flex items-center gap-2">
              <Cpu size={11} className="text-brand/40" />
              Target Architecture (Model)
            </label>
            {selectedProvider && (
              <button 
                onClick={() => refetchModels()} 
                className="text-[9px] font-black text-brand hover:text-brand-hover flex items-center gap-1"
                disabled={isLoadingModels}
              >
                <RefreshCw size={9} className={isLoadingModels ? "animate-spin" : ""} />
                Force Sync
              </button>
            )}
          </div>
          <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedProvider || isLoadingModels}>
            <SelectTrigger className="rounded-none border-border bg-bg/50 h-10 font-mono text-[11px]">
              <SelectValue placeholder={isLoadingModels ? "SYNCHRONIZING..." : "CHOOSE ACTIVE MODEL"} />
            </SelectTrigger>
            <SelectContent>
              {models?.map((m: any) => (
                <SelectItem key={m.id} value={m.id} className="font-mono text-[11px] rounded-none">
                  {m.name}
                </SelectItem>
              ))}
              {!models?.length && selectedModel && (
                   <SelectItem value={selectedModel} className="font-mono text-[11px] rounded-none">
                   {selectedModel} (PERSISTED)
                 </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isUpdating || !selectedProvider} 
          className="rounded-none px-8 font-black text-[10px] h-10 shadow-lg"
          leftIcon={isUpdating ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
        >
          {isUpdating ? "Synchronizing..." : "Initialize Agent"}
        </Button>
      </div>
    </div>
  );
}
