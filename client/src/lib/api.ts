import axios, { AxiosError } from "axios";
import type {
  SuccessResponse,
  ErrorResponse,
} from "@doospace/shared";
import { API_BASE_URL } from "@/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// Request interceptor to add the access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle 401 Unauthorized and data extraction
api.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 and Refresh Token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        // Use global axios to avoid interceptor loop if possible,
        // or just ensure we don't retry the refresh call itself
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {
            refreshToken,
          },
        );

        const { accessToken } = response.data.data;

        localStorage.setItem("access_token", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Standardize error format
    const errorData = error.response?.data as ErrorResponse;
    return Promise.reject(errorData || { ok: false, message: error.message });
  },
);

/**
 * Enhanced request wrapper to handle responses consistently.
 * Accepts any promise (usually from axios after interception) and returns a standard shape.
 */
export async function handleRequest<T>(
  promise: Promise<any>,
): Promise<{ ok: boolean; data: T | null; message: string }> {
  try {
    const res = (await promise) as SuccessResponse<T>;
    return {
      ok: true,
      data: res.data ?? null,
      message: res.message || "Success",
    };
  } catch (error: any) {
    // If the error is already a standardized ErrorResponse
    if (error && typeof error === "object" && "ok" in error && !error.ok) {
      return {
        ok: false,
        data: null,
        message: error.message || "Request failed",
      };
    }
    
    return {
      ok: false,
      data: null,
      message: error.message || "Something went wrong",
    };
  }
}


export default api;
