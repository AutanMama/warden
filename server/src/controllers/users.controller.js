import prisma from "../lib/prisma.js";
import { writeAudit } from "../lib/audit.js";

const VALID_ROLES = ["ADMIN", "MANAGER", "STAFF"];
const SELECT = { id: true, name: true, email: true, role: true, isActive: true };

export async function list(req, res) {
  const users = await prisma.user.findMany({
    select: SELECT,
    orderBy: { createdAt: "asc" },
  });

  res.json({ users });
}

export async function updateRole(req, res) {
  const { role } = req.body;

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ message: `Role must be one of: ${VALID_ROLES.join(", ")}.` });
  }

  if (req.params.id === req.user.id) {
    return res.status(403).json({ message: "You cannot change your own role." });
  }

  const target = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!target) return res.status(404).json({ message: "User not found." });

  if (target.role === role) {
    return res.json({ user: { id: target.id, name: target.name, email: target.email, role: target.role, isActive: target.isActive } });
  }

  const updated = await prisma.user.update({
    where: { id: target.id },
    data: { role },
    select: SELECT,
  });

  await writeAudit({
    actorId: req.user.id,
    action: "UPDATE_USER_ROLE",
    resource: target.name,
    before: target.role,
    after: role,
  });

  res.json({ user: updated });
}

export async function updateStatus(req, res) {
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
    return res.status(400).json({ message: "isActive must be true or false." });
  }

  if (req.params.id === req.user.id) {
    return res.status(403).json({ message: "You cannot disable your own account." });
  }

  const target = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!target) return res.status(404).json({ message: "User not found." });

  if (target.isActive === isActive) {
    return res.json({ user: { id: target.id, name: target.name, email: target.email, role: target.role, isActive: target.isActive } });
  }

  const updated = await prisma.user.update({
    where: { id: target.id },
    data: { isActive },
    select: SELECT,
  });

  await writeAudit({
    actorId: req.user.id,
    action: isActive ? "ENABLED_USER" : "DISABLED_USER",
    resource: target.name,
    before: target.isActive ? "Active" : "Disabled",
    after: isActive ? "Active" : "Disabled",
  });

  res.json({ user: updated });
}
