import { logger } from "@/lib/logger";
import { z } from "zod";

const envSchema = z.object({
  // Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Server
  PORT: z.string().transform(Number).default(3000),

  // Database
  POSTGRESQL_URL: z.string().min(1, "POSTGRESQL_URL is required"),
});

const parse = envSchema.safeParse(process.env);

if (!parse.success) {
  logger.error("Invalid environment variables:", parse.error);
  process.exit(1);
}

const env = parse.data;

const isProduction = env.NODE_ENV === "production";
const isDevelopment = env.NODE_ENV === "development";

export { env, isDevelopment, isProduction };
