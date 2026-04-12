import api, { handleRequest } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import type { SuccessResponse } from "@doospace/shared";

export const authService = {
  login: async (data: any) => {
    const result = await handleRequest(api.post<SuccessResponse<any>>("/auth/login", data));
    
    if (result.ok && result.data) {
      const { user, accessToken, refreshToken } = result.data;
      useAuthStore.getState().setAuth(user, accessToken, refreshToken);
    }
    
    return result;
  },

  logout: () => {
    useAuthStore.getState().logout();
  },
};

