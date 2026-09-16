import { Router } from "express";
import { requireAuth, requirePermission } from "../middleware/auth.js";
import { list } from "../controllers/users.controller.js";

const router = Router();

router.get("/", requireAuth, requirePermission("manage_users"), list);

export default router;
