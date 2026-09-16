import { Router } from "express";
import { requireAuth, requirePermission } from "../middleware/auth.js";
import { list } from "../controllers/auditLog.controller.js";

const router = Router();

router.get("/", requireAuth, requirePermission("view_audit_log"), list);

export default router;
