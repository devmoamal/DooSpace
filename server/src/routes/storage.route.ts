import { Hono } from "hono";
import { storageRepository } from "@/repositories/storage.repository";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { validateParams } from "@/middlewares/validate.middleware";
import { IdParamSchema } from "@doospace/shared";
import { z } from "zod";
import Response from "@/lib/response";

import { storageService } from "@/services/storage.service";

const router = new Hono();

// Protect all storage management routes
router.use("*", authMiddleware);

// Get storage usage summary for all Doos
router.get("/usage", async (c) => {
  const stats = await storageService.getUsageStats();
  return Response.success(c, stats);
});

// List all storage keys for a Doo
router.get("/:id", validateParams(IdParamSchema), async (c) => {
  const dooId = parseInt(c.req.param("id"), 10);
  const data = await storageRepository.list(dooId);
  return Response.success(c, data);
});

// Get a specific storage key
router.get(
  "/:id/:key",
  validateParams(IdParamSchema.extend({ key: z.string() })),
  async (c) => {
    const dooId = parseInt(c.req.param("id"), 10);
    const key = c.req.param("key");
    const data = await storageRepository.get(dooId, key);
    return Response.success(c, data);
  }
);

// Delete a storage key
router.delete(
  "/:id/:key",
  validateParams(IdParamSchema.extend({ key: z.string() })),
  async (c) => {
    const dooId = parseInt(c.req.param("id"), 10);
    const key = c.req.param("key");
    const deleted = await storageRepository.delete(dooId, key);
    return Response.success(c, { deleted }, "Storage key deleted");
  }
);

// Set a storage key
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
    
    const data = await storageRepository.set(
      dooId, 
      key, 
      parsedValue, 
      expire_at ? new Date(expire_at) : undefined
    );
    return Response.success(c, data, "Storage key set successfully");
  }
);

export default router;
