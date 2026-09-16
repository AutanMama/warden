import prisma from "../lib/prisma.js";

export async function list(req, res) {
  const events = await prisma.auditLog.findMany({
    include: { actor: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  res.json({
    events: events.map((e) => ({
      id: e.id,
      time: e.createdAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      date: e.createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      user: e.actor.name,
      action: e.action,
      resource: e.resource,
      result: e.result,
      before: e.before,
      after: e.after,
    })),
  });
}
