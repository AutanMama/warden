import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

function toPublicUser(user) {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

function signToken(user) {
  return jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function register(req, res) {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Email, password, and name are required." });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  // Self-registration always creates a STAFF account. Promotion to
  // MANAGER/ADMIN happens via an authenticated admin action, never here —
  // otherwise anyone could register their own way into admin access.
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, name, role: "STAFF" },
  });

  res.status(201).json({ token: signToken(user), user: toPublicUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  if (!user.isActive) {
    return res.status(423).json({ message: "This account has been disabled. Contact an administrator." });
  }

  res.json({ token: signToken(user), user: toPublicUser(user) });
}

export async function me(req, res) {
  res.json({ user: toPublicUser(req.user) });
}
