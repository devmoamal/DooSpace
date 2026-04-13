import api, { handleRequest } from "@/lib/api";
import type { DooBoxUsage } from "@doospace/shared";

export const dooboxService = {
  getUsage: () =>
    handleRequest<DooBoxUsage[]>(api.get("/doobox/usage")),

  getKeys: (dooId: number) =>
    handleRequest<any[]>(api.get(`/doobox/${dooId}`)),

  setKey: (dooId: number, key: string, value: any) =>
    handleRequest<any>(api.post(`/doobox/${dooId}`, { key, value })),

  deleteKey: (dooId: number, key: string) =>
    handleRequest<any>(api.delete(`/doobox/${dooId}/${key}`)),

  executeSql: (dooId: number, query: string) =>
    handleRequest<any>(api.post(`/doobox/${dooId}/sql`, { query })),
};
