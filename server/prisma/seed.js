import bcrypt from "bcryptjs";
import prisma from "../src/lib/prisma.js";

const demoUsers = [
  { email: "admin@warden.dev", password: "password123", name: "Amina Bello", role: "ADMIN" },
  { email: "manager@warden.dev", password: "password123", name: "Chidi Okafor", role: "MANAGER" },
  { email: "staff@warden.dev", password: "password123", name: "Tunde Adebayo", role: "STAFF" },
];

async function main() {
  for (const u of demoUsers) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { email: u.email, passwordHash, name: u.name, role: u.role },
    });
  }
  console.log("Seeded demo users:");
  demoUsers.forEach((u) => console.log(`  ${u.role.padEnd(8)} ${u.email} / ${u.password}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
