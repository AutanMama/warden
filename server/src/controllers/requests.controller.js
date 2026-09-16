import prisma from "../lib/prisma.js";
import { can } from "../lib/permissions.js";
import { writeAudit } from "../lib/audit.js";

const MAKER_SELECT = { select: { id: true, name: true, role: true, email: true } };

function serialize(r) {
  return {
    id: r.id,
    title: r.title,
    item: r.item,
    amount: r.amount,
    department: r.department,
    reason: r.reason,
    status: r.status.toLowerCase(),
    submittedAt: r.createdAt,
    decidedAt: r.decidedAt,
    maker: r.maker,
    decidedBy: r.decidedBy,
  };
}

export async function list(req, res) {
  const isApprover = can(req.user.role, "approve_request");

  const requests = await prisma.request.findMany({
    where: isApprover ? {} : { makerId: req.user.id },
    include: { maker: MAKER_SELECT, decidedBy: MAKER_SELECT },
    orderBy: { createdAt: "desc" },
  });

  res.json({ requests: requests.map(serialize) });
}

export async function getOne(req, res) {
  const request = await prisma.request.findUnique({
    where: { id: req.params.id },
    include: { maker: MAKER_SELECT, decidedBy: MAKER_SELECT },
  });

  if (!request) return res.status(404).json({ message: "Request not found." });

  const isApprover = can(req.user.role, "approve_request");
  if (!isApprover && request.makerId !== req.user.id) {
    return res.status(403).json({ message: "You can only view your own requests." });
  }

  res.json({ request: serialize(request) });
}

export async function history(req, res) {
  const request = await prisma.request.findUnique({ where: { id: req.params.id } });
  if (!request) return res.status(404).json({ message: "Request not found." });

  const isApprover = can(req.user.role, "approve_request");
  if (!isApprover && request.makerId !== req.user.id) {
    return res.status(403).json({ message: "You can only view your own requests." });
  }

  const events = await prisma.auditLog.findMany({
    where: { requestId: request.id },
    include: { actor: { select: { name: true } } },
    orderBy: { createdAt: "asc" },
  });

  res.json({
    history: events.map((e) => ({
      time: e.createdAt,
      actor: e.actor.name,
      label:
        e.action === "CREATED_REQUEST"
          ? "Created request"
          : e.action === "APPROVED_REQUEST"
          ? "Approved request"
          : "Rejected request",
    })),
  });
}

export async function create(req, res) {
  const { title, item, amount, department, reason } = req.body;

  if (!title || !item || !department || !reason) {
    return res.status(400).json({ message: "title, item, department, and reason are required." });
  }

  const request = await prisma.request.create({
    data: { title, item, amount: amount || "—", department, reason, makerId: req.user.id },
    include: { maker: MAKER_SELECT, decidedBy: MAKER_SELECT },
  });

  await writeAudit({
    actorId: req.user.id,
    action: "CREATED_REQUEST",
    resource: request.id,
    after: "Pending",
    requestId: request.id,
  });

  res.status(201).json({ request: serialize(request) });
}

async function decide(req, res, status) {
  const request = await prisma.request.findUnique({ where: { id: req.params.id } });
  if (!request) return res.status(404).json({ message: "Request not found." });

  if (request.status !== "PENDING") {
    return res.status(409).json({ message: "This request has already been decided." });
  }

  if (request.makerId === req.user.id) {
    return res.status(403).json({ message: "You cannot approve a request you submitted." });
  }

  const updated = await prisma.request.update({
    where: { id: request.id },
    data: { status, decidedAt: new Date(), decidedById: req.user.id },
    include: { maker: MAKER_SELECT, decidedBy: MAKER_SELECT },
  });

  await writeAudit({
    actorId: req.user.id,
    action: status === "APPROVED" ? "APPROVED_REQUEST" : "REJECTED_REQUEST",
    resource: request.id,
    before: "Pending",
    after: status === "APPROVED" ? "Approved" : "Rejected",
    requestId: request.id,
  });

  res.json({ request: serialize(updated) });
}

export const approve = (req, res) => decide(req, res, "APPROVED");
export const reject = (req, res) => decide(req, res, "REJECTED");
