import { Router } from "express";
import { requireAuth, requirePermission } from "../middleware/auth.js";
import { list, updateRole, updateStatus } from "../controllers/users.controller.js";

const router = Router();

router.get("/", requireAuth, requirePermission("manage_users"), list);
router.patch("/:id/role", requireAuth, requirePermission("manage_roles"), updateRole);
router.patch("/:id/status", requireAuth, requirePermission("manage_users"), updateStatus);

export default router;
