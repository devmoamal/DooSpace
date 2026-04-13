import { app } from "@/app";
import { env } from "@/config/env.config";
import { logger } from "@/lib/logger";
import { dooboxWorker } from "@/workers/doobox.worker";

const server = {
  port: env.PORT,
  fetch: app.fetch,
};

// Start Background Workers
dooboxWorker.start();

logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);

// Graceful shutdown
const shutdown = () => {
  logger.info("Shutdown signal received. Closing server...");
  dooboxWorker.stop();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);


export default server;
