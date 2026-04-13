/**
 * Global Constants
 */

export const API_BASE_URL = "http://localhost:3000";

export const PAGINATION = {
  DEFAULT_LIMIT: 15,
  MAX_LIMIT: 100,
};

/**
 * Centeralized Query Keys for TanStack Query
 */
export const QUERY_KEYS = {
  DOOS: {
    ALL: ["doos"] as const,
    LIST: (params: any) => ["doos", "list", params] as const,
    DETAIL: (id: number) => ["doos", "detail", id] as const,
  },
  AUTH: {
    USER: ["auth", "user"] as const,
  },
  REQUESTS: {
    ALL: ["requests"] as const,
    LIST: (params: any) => ["requests", "list", params] as const,
    LOGS: (dooId: number) => ["requests", "logs", dooId] as const,
  },
  DOOBOX: {
    USAGE: ["doobox", "usage"] as const,
    DETAIL: (dooId: number) => ["doobox", "detail", dooId] as const,
  },
  OVERVIEW: {
    STATS: ["overview", "stats"] as const,
    CHARTS: ["overview", "charts"] as const,
  },
};

