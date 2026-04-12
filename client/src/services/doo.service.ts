import api, { handleRequest } from "@/lib/api";
import type { Doo, PaginatedResponse } from "@doospace/shared";

export const dooService = {
  getAll: (params?: any) =>
    handleRequest<PaginatedResponse<Doo>>(api.get("/doos", { params })),

  getById: (id: number) => handleRequest<Doo>(api.get(`/doos/${id}`)),

  create: (data: Partial<Doo>) => handleRequest<Doo>(api.post("/doos", data)),

  update: (id: number, data: Partial<Doo>) =>
    handleRequest<Doo>(api.put(`/doos/${id}`, data)),

  delete: (id: number) => handleRequest<any>(api.delete(`/doos/${id}`)),

  execute: (
    id: number,
    subpath: string = "/",
    method: string = "GET",
    body: any = null,
  ) => {
    const url = `/doos/doo_${id}${subpath.startsWith("/") ? subpath : "/" + subpath}`;
    const promise =
      method === "POST"
        ? api.post(url, body)
        : method === "PUT"
          ? api.put(url, body)
          : method === "DELETE"
            ? api.delete(url)
            : api.get(url);
    return handleRequest<any>(promise);
  },

  getLogs: (doo_id: number) =>
    handleRequest<any[]>(api.get(`/requests/${doo_id}`)),

  toggleActive: (id: number) =>
    handleRequest<Doo>(api.patch(`/doos/${id}/active`)),
};
