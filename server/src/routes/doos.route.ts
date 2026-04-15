import { Hono } from "hono";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "@/middlewares/validate.middleware";
import { authMiddleware } from "@/middlewares/auth.middleware";

import {
  DooSchema,
  IdParamSchema,
  PaginationSchema,
  type Doo,
} from "@doospace/shared";
import { dooService } from "@/services/doo.service";
import { executionService } from "@/services/execution.service";
import Response from "@/lib/response";

const router = new Hono();

// EXECUTION ROUTES: Trigger Doo Code
// These must be defined before the generic /:id route to avoid collisions

// 1. Root path (e.g., /doos/doo_19)
router.all("/:id{doo_[0-9]+}", async (c) => {
  const idStr = c.req.param("id").replace("doo_", "");
  const id = parseInt(idStr, 10);

  const response = await executionService.executeDoo(
    id,
    c.req.method,
    "/",
    c.req.raw,
  );

  // Wrap response to preserve CORS headers from middleware
  return c.newResponse(response.body, response);
});

// 2. Subpaths (e.g., /doos/doo_19/hello)
router.all("/:id{doo_[0-9]+}/:subpath{.*}", async (c) => {
  const idStr = c.req.param("id").replace("doo_", "");
  const id = parseInt(idStr, 10);

  let subpath = c.req.param("subpath");
  if (!subpath.startsWith("/")) subpath = "/" + subpath;

  const response = await executionService.executeDoo(
    id,
    c.req.method,
    subpath,
    c.req.raw,
  );

  // Wrap response to preserve CORS headers from middleware
  return c.newResponse(response.body, response);
});

// List all Doos
router.get("/", validateQuery(PaginationSchema), async (c) => {
  const query = c.req.valid("query");
  const doos = await dooService.getAllDoos(query);
  return Response.success(c, doos);
});

// Get one Doo
router.get("/:id{[0-9]+}", validateParams(IdParamSchema), async (c) => {
  const { id } = c.req.valid("param");
  const doo = await dooService.getDooById(id);
  return Response.success(c, doo);
});

// Create Doo
router.post("/", authMiddleware, validateBody(DooSchema), async (c) => {
  const data = c.req.valid("json");
  const auth = c.get("auth");
  const newDoo = await dooService.createDoo({ ...data, owner_id: auth.id });
  return Response.success(c, newDoo, "Doo created successfully", 201);
});

// Update Doo
router.put(
  "/:id{[0-9]+}",
  validateParams(IdParamSchema),
  validateBody(DooSchema.partial()),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const updatedDoo = await dooService.updateDoo(id, data);
    return Response.success(c, updatedDoo, "Doo updated successfully");
  },
);

// Toggle Active Status
router.patch(
  "/:id{[0-9]+}/active",
  validateParams(IdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const updatedDoo = await dooService.toggleActiveStatus(id);
    return Response.success(c, updatedDoo, "Status updated successfully");
  },
);

// Delete Doo
router.delete("/:id{[0-9]+}", validateParams(IdParamSchema), async (c) => {
  const { id } = c.req.valid("param");
  const deletedDoo = await dooService.deleteDoo(id);
  return Response.success(c, deletedDoo, "Doo deleted successfully");
});

export default router;
