import { useState, useEffect } from "react";
import { type Endpoint } from "@doospace/shared";
import {
  parseTSFields,
  extractPathParams,
  buildPathWithParams,
  type ParsedField,
} from "@/utils/typeParser";
import { API_BASE_URL } from "@/constants";

export type BodyMode = "form" | "keyvalue" | "raw";
export type PlaygroundTab = "params" | "body" | "headers";

export function usePlayground(id: number) {
  const [activeTab, setActiveTab] = useState<PlaygroundTab>("params");

  // Request State
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("/");
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(
    null,
  );

  const [params, setParams] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<Record<string, string>>({});

  const [bodyMode, setBodyMode] = useState<BodyMode>("form");
  const [parsedFields, setParsedFields] = useState<ParsedField[] | null>(null);
  const [formBody, setFormBody] = useState<Record<string, string>>({});

  const [kvBody, setKvBody] = useState<{ k: string; v: string }[]>([
    { k: "", v: "" },
  ]);
  const [rawBody, setRawBody] = useState("{}");

  // Response State
  const [isSending, setIsSending] = useState(false);
  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    time: number;
    body: any;
    headers: Record<string, string>;
  } | null>(null);

  // When endpoint is selected, prefill forms
  useEffect(() => {
    if (selectedEndpoint) {
      setMethod(selectedEndpoint.method);
      setPath(selectedEndpoint.path);

      const fields = parseTSFields(selectedEndpoint.request_type);
      setParsedFields(fields);

      if (fields) {
        setBodyMode("form");
        const initialForm: Record<string, string> = {};
        fields.forEach((f) => (initialForm[f.name] = ""));
        setFormBody(initialForm);
      } else {
        setBodyMode(selectedEndpoint.method === "GET" ? "raw" : "keyvalue");
      }
    }
  }, [selectedEndpoint]);

  // Extract path params live
  const pathParams = extractPathParams(path);
  useEffect(() => {
    setParams((prev) => {
      const next = { ...prev };
      for (const p of pathParams) {
        if (!next[p]) next[p] = "";
      }
      return next;
    });
  }, [pathParams]);

  const handleSend = async () => {
    if (!id) return;
    setIsSending(true);
    setResponse(null);
    const startTime = Date.now();

    try {
      const finalPath = buildPathWithParams(path, params);
      const url = `${API_BASE_URL}/doos/doo_${id}${
        finalPath.startsWith("/") ? "" : "/"
      }${finalPath}`;

      const reqHeaders = new Headers();
      reqHeaders.set("Content-Type", "application/json");
      Object.entries(headers).forEach(([k, v]) => {
        if (k.trim()) reqHeaders.set(k.trim(), v.trim());
      });

      let reqBody: any = undefined;
      if (["POST", "PUT", "PATCH"].includes(method)) {
        if (bodyMode === "form") {
          const parsedForm: any = {};
          for (const [k, v] of Object.entries(formBody)) {
            if (!Number.isNaN(Number(v))) parsedForm[k] = Number(v);
            else if (v === "true") parsedForm[k] = true;
            else if (v === "false") parsedForm[k] = false;
            else parsedForm[k] = v;
          }
          reqBody = JSON.stringify(parsedForm);
        } else if (bodyMode === "keyvalue") {
          const dict: any = {};
          kvBody.forEach(({ k, v }) => {
            if (k.trim()) dict[k.trim()] = v;
          });
          reqBody = JSON.stringify(dict);
        } else {
          reqBody = rawBody;
        }
      }

      const res = await fetch(url, {
        method,
        headers: reqHeaders,
        body: reqBody,
      });

      const time = Date.now() - startTime;
      const resHeaders: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        resHeaders[k] = v;
      });

      const rawText = await res.text();
      let resBody;
      try {
        resBody = JSON.parse(rawText);
      } catch {
        resBody = rawText;
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        time,
        headers: resHeaders,
        body: resBody,
      });
    } catch (error: any) {
      setResponse({
        status: 0,
        statusText: "Network Error",
        time: Date.now() - startTime,
        headers: {},
        body: String(error),
      });
    } finally {
      setIsSending(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    method,
    setMethod,
    path,
    setPath,
    selectedEndpoint,
    setSelectedEndpoint,
    params,
    setParams,
    headers,
    setHeaders,
    bodyMode,
    setBodyMode,
    parsedFields,
    formBody,
    setFormBody,
    kvBody,
    setKvBody,
    rawBody,
    setRawBody,
    isSending,
    response,
    handleSend,
    pathParams,
  };
}
