import bcrypt from "bcryptjs";
import prisma from "../src/lib/prisma.js";

const demoUsers = [
  { email: "admin@warden.dev", password: "password123", name: "Amina Bello", role: "ADMIN" },
  { email: "manager@warden.dev", password: "password123", name: "Chidi Okafor", role: "MANAGER" },
  { email: "staff@warden.dev", password: "password123", name: "Tunde Adebayo", role: "STAFF" },
];

const daysAgo = (n) => new Date(Date.now() - n * 86400000);

async function seedUsers() {
  const users = {};
  for (const u of demoUsers) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { email: u.email, passwordHash, name: u.name, role: u.role },
    });
    users[u.role] = user;
  }
  return users;
}

async function seedRequests(users) {
  const existing = await prisma.request.count();
  if (existing > 0) {
    console.log(`Skipping request seed — ${existing} requests already exist.`);
    return;
  }

  const { ADMIN, MANAGER, STAFF } = users;

  const requests = [
    { title: "Laptop Procurement", item: 'MacBook Pro 14"', amount: "₦850,000", department: "Engineering", reason: "Developer workstation replacement — current unit out of warranty.", maker: STAFF, status: "PENDING", age: 0 },
    { title: "Payment Approval", item: "Vendor invoice #4471", amount: "₦1,250,000", department: "Finance", reason: "Quarterly infrastructure hosting invoice.", maker: MANAGER, status: "APPROVED", decider: ADMIN, age: 0 },
    { title: "Access Request", item: "Production database read access", amount: "—", department: "Engineering", reason: "On-call rotation this sprint.", maker: STAFF, status: "REJECTED", decider: MANAGER, age: 1 },
    { title: "Software License Renewal", item: "Figma Organization plan", amount: "₦420,000", department: "Design", reason: "Annual renewal for the design team's 6 seats.", maker: MANAGER, status: "APPROVED", decider: ADMIN, age: 2 },
    { title: "Marketing Ad Spend", item: "Q3 LinkedIn campaign", amount: "₦2,100,000", department: "Marketing", reason: "Lead-gen campaign ahead of product launch.", maker: ADMIN, status: "PENDING", age: 2 },
    { title: "Office Equipment", item: "Standing desks (x4)", amount: "₦680,000", department: "Operations", reason: "Ergonomic upgrade for the Abuja office.", maker: STAFF, status: "APPROVED", decider: ADMIN, age: 3 },
    { title: "Cloud Infrastructure Upgrade", item: "Database instance resize", amount: "₦390,000", department: "Engineering", reason: "Current instance hitting memory limits under peak load.", maker: MANAGER, status: "PENDING", age: 3 },
    { title: "Vendor Contract", item: "Payroll processor renewal", amount: "₦1,800,000", department: "Finance", reason: "12-month renewal, negotiated 8% discount vs last cycle.", maker: ADMIN, status: "APPROVED", decider: MANAGER, age: 4 },
    { title: "Recruitment Spend", item: "Senior backend engineer — agency fee", amount: "₦950,000", department: "Engineering", reason: "Contingency fee for a filled backend role.", maker: STAFF, status: "REJECTED", decider: ADMIN, age: 5 },
  ];

  for (const r of requests) {
    const createdAt = daysAgo(r.age);
    const decidedAt = r.decider ? new Date(createdAt.getTime() + 3 * 3600000) : null;

    const request = await prisma.request.create({
      data: {
        title: r.title,
        item: r.item,
        amount: r.amount,
        department: r.department,
        reason: r.reason,
        status: r.status,
        makerId: r.maker.id,
        decidedById: r.decider?.id,
        createdAt,
        decidedAt,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: r.maker.id,
        action: "CREATED_REQUEST",
        resource: request.id,
        after: "Pending",
        requestId: request.id,
        createdAt,
      },
    });

    if (r.decider) {
      await prisma.auditLog.create({
        data: {
          actorId: r.decider.id,
          action: r.status === "APPROVED" ? "APPROVED_REQUEST" : "REJECTED_REQUEST",
          resource: request.id,
          before: "Pending",
          after: r.status === "APPROVED" ? "Approved" : "Rejected",
          requestId: request.id,
          createdAt: decidedAt,
        },
      });
    }
  }

  console.log(`Seeded ${requests.length} requests with audit history.`);
}

async function main() {
  const users = await seedUsers();
  await seedRequests(users);

  console.log("Seeded demo users:");
  demoUsers.forEach((u) => console.log(`  ${u.role.padEnd(8)} ${u.email} / ${u.password}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
