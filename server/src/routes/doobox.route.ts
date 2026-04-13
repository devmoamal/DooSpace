import { Hono } from "hono";
import { dooboxRepository } from "@/repositories/doobox.repository";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { validateParams } from "@/middlewares/validate.middleware";
import { IdParamSchema } from "@doospace/shared";
import { z } from "zod";
import Response from "@/lib/response";

import { dooboxService } from "@/services/doobox.service";

const router = new Hono();

// Protect all doobox management routes
router.use("*", authMiddleware);

// Get doobox usage summary for all Doos
router.get("/usage", async (c) => {
  const stats = await dooboxService.getUsageStats();
  return Response.success(c, stats);
});

// List all doobox keys for a Doo
router.get("/:id", validateParams(IdParamSchema), async (c) => {
  const dooId = parseInt(c.req.param("id"), 10);
  const data = await dooboxRepository.list(dooId);
  return Response.success(c, data);
});

// Get a specific doobox key
router.get(
  "/:id/:key",
  validateParams(IdParamSchema.extend({ key: z.string() })),
  async (c) => {
    const dooId = parseInt(c.req.param("id"), 10);
    const key = c.req.param("key");
    const data = await dooboxRepository.get(dooId, key);
    return Response.success(c, data);
  }
);

// Delete a doobox key
router.delete(
  "/:id/:key",
  validateParams(IdParamSchema.extend({ key: z.string() })),
  async (c) => {
    const dooId = parseInt(c.req.param("id"), 10);
    const key = c.req.param("key");
    const deleted = await dooboxRepository.delete(dooId, key);
    return Response.success(c, { deleted }, "DooBox key deleted");
  }
);

// Set a doobox key
router.post(
  "/:id",
  validateParams(IdParamSchema),
  async (c) => {
    const dooId = parseInt(c.req.param("id"), 10);
    const { key, value, expire_at } = await c.req.json();
    
    if (!key) return Response.error(c, "BAD_REQUEST", "Key is required", 400);
    
    // Parse value as JSON if it's a string, otherwise use directly
    let parsedValue = value;
    if (typeof value === "string") {
      try { parsedValue = JSON.parse(value); } catch(e) { /* use string */ }
    }
    
    const data = await dooboxRepository.set(
      dooId, 
      key, 
      parsedValue, 
      expire_at ? new Date(expire_at) : undefined
    );
    return Response.success(c, data, "DooBox key set successfully");
  }
);

// Execute raw SQL query for a Doo
router.post(
  "/:id/sql",
  validateParams(IdParamSchema),
  async (c) => {
    const dooId = parseInt(c.req.param("id"), 10);
    const { query } = await c.req.json();
    
    if (!query) return Response.error(c, "BAD_REQUEST", "Query is required", 400);
    
    try {
      const result = await dooboxRepository.executeSql(dooId, query);
      return Response.success(c, result, "SQL executed successfully");
    } catch (error: any) {
      return Response.error(c, "INTERNAL_SERVER_ERROR", error.message || "SQL execution failed", 500);
    }
  }
);

export default router;
