import prisma from "../lib/prisma.js";

export async function list(req, res) {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { createdAt: "asc" },
  });

  res.json({ users });
}
