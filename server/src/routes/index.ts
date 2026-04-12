import { Hono } from "hono";
import doosRoutes from "./doos.route";
import requestsRoutes from "./requests.route";
import settingsRoutes from "./settings.route";
import authRoutes from "./auth.route";
import storageRoutes from "./storage.route";
import overviewRoutes from "./overview.route";

const router = new Hono();

router.route("/auth", authRoutes);
router.route("/doos", doosRoutes);
router.route("/requests", requestsRoutes);
router.route("/settings", settingsRoutes);
router.route("/storage", storageRoutes);
router.route("/overview", overviewRoutes);

export default router;



