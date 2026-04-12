import { Context } from "hono";
import { ZodError } from "zod";
import { AppError } from "@/lib/error";
import { logger } from "@/lib/logger";
import Response from "@/lib/response";
import { API_ERROR_CODE } from "@doospace/shared";
import { isDevelopment } from "@/config/env.config";

export const errorHandler = (err: Error, c: Context) => {
  const requestId = c.get("requestId" as any) || "unknown";

  if (isDevelopment) {
    logger.error(err);
  }

  // Zod Validation Error
  if (err instanceof ZodError) {
    const message = err.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");

    logger.error(`[${requestId}] Validation Error: ${message}`);

    return Response.error(
      c,
      API_ERROR_CODE.VALIDATION_ERROR,
      `Validation failed: ${message}`,
      400,
    );
  }

  // Application Error
  if (err instanceof AppError) {
    logger.error(`[${requestId}] App Error: ${err.message}`);
    return Response.error(c, err.code as any, err.message, err.status as any);
  }

  // Unexpected Error
  logger.error(`[${requestId}] Internal Server Error:`, err);
  return Response.error(
    c,
    API_ERROR_CODE.SERVER_ERROR,
    "An unexpected error occurred",
    500,
  );
};
