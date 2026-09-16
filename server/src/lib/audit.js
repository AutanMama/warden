import prisma from "./prisma.js";

export function writeAudit({ actorId, action, resource, before, after, requestId }) {
  return prisma.auditLog.create({
    data: { actorId, action, resource, before, after, requestId },
  });
}
