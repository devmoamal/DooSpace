import api, { handleRequest } from "@/lib/api";
import type { SuccessResponse } from "@doospace/shared";

export const requestService = {
  getAll: (params?: any) =>
    handleRequest<any[]>(api.get("/requests", { params })),

  getByDoo: (dooId: number) =>
    handleRequest<any[]>(api.get(`/requests/${dooId}`)),
};
