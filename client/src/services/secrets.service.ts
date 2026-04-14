import api, { handleRequest } from "@/lib/api";

export interface SecretMeta {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export const secretsService = {
  list: () => handleRequest<SecretMeta[]>(api.get("/secrets")),

  set: (name: string, value: string) =>
    handleRequest<SecretMeta>(api.post("/secrets", { name, value })),

  delete: (name: string) =>
    handleRequest<{ deleted: boolean }>(api.delete(`/secrets/${name}`)),
};
