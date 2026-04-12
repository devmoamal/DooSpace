import { Context, Next } from "hono";
import { logger } from "@/lib/logger";

export const loggerMiddleware = async (c: Context, next: Next) => {
  const { method, path } = c.req;
  const requestId = c.get("requestId" as any) || "unknown";
  const start = performance.now();

  await next();

  const duration = (performance.now() - start).toFixed(2);
  const status = c.res.status;

  let statusColor = "\x1b[32m"; // Green
  if (status >= 500) statusColor = "\x1b[31m"; // Red
  else if (status >= 400) statusColor = "\x1b[33m"; // Yellow
  else if (status >= 300) statusColor = "\x1b[36m"; // Cyan

  logger.info(
    `[${requestId}] ${method} ${path} - ${statusColor}${status}\x1b[0m in ${duration}ms`
  );
};
