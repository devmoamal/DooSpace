import api, { handleRequest } from "@/lib/api";
import type { Loop, CreateLoopDTO, UpdateLoopDTO, LoopLog } from "@doospace/shared";

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export const loopService = {
  getAll: (params?: any) =>
    handleRequest<PaginatedResponse<Loop>>(api.get("/loops", { params })),

  getById: (id: string) => handleRequest<Loop>(api.get(`/loops/${id}`)),

  create: (data: CreateLoopDTO) => handleRequest<Loop>(api.post("/loops", data)),

  updateStatus: (id: string, status: "active" | "paused") =>
    handleRequest<Loop>(api.patch(`/loops/${id}/status`, { status })),

  update: (id: string, data: UpdateLoopDTO) =>
    handleRequest<Loop>(api.patch(`/loops/${id}`, data)),

  delete: (id: string) => handleRequest<any>(api.delete(`/loops/${id}`)),

  getLogs: (id: string, params?: any) =>
    handleRequest<PaginatedResponse<LoopLog>>(api.get(`/loops/${id}/logs`, { params })),
};
