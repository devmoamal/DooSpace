import { API_ERROR_CODE } from "@/constants";

/**
 * Base API response
 */
export type ApiResponse = {
  ok: boolean;
  message?: string;
};

/**
 * Success response with data
 */
export type SuccessResponse<T> = ApiResponse & {
  data?: T;
  ok: true;
};

/**
 * Error response
 */
export type ErrorResponse = ApiResponse & {
  ok: false;
  error?: ErrorCode;
};

/**
 * API error codes
 */
export type ErrorCode = (typeof API_ERROR_CODE)[keyof typeof API_ERROR_CODE];

/**
 * Overview Statistics
 */
export interface OverviewStats {
  doos: {
    total: number;
    active: number;
    inactive: number;
  };
  requests: {
    total: number;
    today: number;
    yesterday: number;
    trend: number; // percentage
    successRate: number; // percentage
  };
  doobox: {
    totalKeys: number;
    totalBytes: number;
    formattedSize: string;
  };
}

/**
 * Chart Data Point
 */
export interface ChartDataPoint {
  date: string;
  count: number;
  [key: string]: any; // Allow for dynamic doo names
}

/**
 * DooBox Usage per Doo
 */
export interface DooBoxUsage {
  dooId: number;
  dooName: string;
  keyCount: number;
  sizeBytes: number;
  formattedSize: string;
}
