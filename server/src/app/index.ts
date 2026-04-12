import { corsMiddleware } from "@/middlewares/cors.middleware";
import { trimSlash } from "@/middlewares/trim-slash.middleware";
import Router from "@/routes";
import { errorHandler } from "@/middlewares/errorHandler.middleware";
import { loggerMiddleware } from "@/middlewares/logger.middleware";
import { requestIdMiddleware } from "@/middlewares/requestId.middleware";
import { NotFoundError } from "@/lib/error";
import { Hono } from "hono";
import { type AuthEnv } from "@/context/auth.context";

// Hono app that start with Bun
export const app = new Hono<AuthEnv>();

// Middlewares

// CORS middleware
app.use("*", corsMiddleware);

// Trailing slash middleware
app.use("*", trimSlash);

// Request ID middleware (must be before logger)
app.use("*", requestIdMiddleware);

// Logger middleware
app.use("*", loggerMiddleware);

// Error handler middleware
app.onError(errorHandler);

// Not found middleware
app.notFound((c) => {
  throw new NotFoundError(`${c.req.method} ${c.req.path} Route not found`);
});

// Health Check
app.get("/health", (c) => c.json({ status: "ok" }));

// Router
const routes = app.route("/", Router);

export type AppType = typeof routes;
