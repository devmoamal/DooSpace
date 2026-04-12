import { Hono } from "hono";
import { validateBody } from "@/middlewares/validate.middleware";
import { z } from "zod";
import { settingsService } from "@/services/settings.service";
import Response from "@/lib/response";

const router = new Hono();

const SettingSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
});

// List all settings
router.get("/", async (c) => {
  const settings = await settingsService.getAllSettings();
  return Response.success(c, settings);
});

// Update or create a setting
router.post("/", validateBody(SettingSchema), async (c) => {
  const { key, value } = c.req.valid("json");
  const setting = await settingsService.updateSetting(key, value);
  return Response.success(c, setting, "Setting updated successfully");
});


export default router;
