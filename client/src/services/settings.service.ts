import api from "@/lib/api";

export interface Setting {
  key: string;
  value: string;
  updated_at: string;
}

export const settingsService = {
  getSettings: async (): Promise<Setting[]> => {
    const response: any = await api.get("/settings");
    return response.data;
  },

  updateSetting: async (key: string, value: string): Promise<Setting> => {
    const response: any = await api.post("/settings", { key, value });
    return response.data;
  },

  getProviders: async () => {
    const response: any = await api.get("/ai/providers");
    return response.data;
  },

  getModels: async (provider: string) => {
    const response: any = await api.get(`/ai/models/${provider}`);
    return response.data;
  },

  chat: async (messages: any[]) => {
    const response: any = await api.post("/ai/chat", { messages });
    return response.data;
  }
};
