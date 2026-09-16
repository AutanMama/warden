import { Router } from "express";
import { requireAuth, requirePermission } from "../middleware/auth.js";
import { list, getOne, create, approve, reject, history } from "../controllers/requests.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", requirePermission("view_requests"), list);
router.get("/:id", requirePermission("view_requests"), getOne);
router.get("/:id/history", requirePermission("view_requests"), history);
router.post("/", requirePermission("create_request"), create);
router.post("/:id/approve", requirePermission("approve_request"), approve);
router.post("/:id/reject", requirePermission("reject_request"), reject);

export default router;
