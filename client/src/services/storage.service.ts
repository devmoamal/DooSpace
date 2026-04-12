import api, { handleRequest } from "@/lib/api";
import type { DooStorageUsage } from "@doospace/shared";

export const storageService = {
  getUsage: () =>
    handleRequest<DooStorageUsage[]>(api.get("/storage/usage")),

  getKeys: (dooId: number) =>
    handleRequest<any[]>(api.get(`/storage/${dooId}`)),

  setKey: (dooId: number, key: string, value: any) =>
    handleRequest<any>(api.post(`/storage/${dooId}`, { key, value })),

  deleteKey: (dooId: number, key: string) =>
    handleRequest<any>(api.delete(`/storage/${dooId}/${key}`)),
};
