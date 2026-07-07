import "dotenv/config";
import { PrismaClient, PlanType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env["DATABASE_URL"]!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.plan.upsert({
    where: {
      type: PlanType.FREE,
    },
    update: {},
    create: {
      name: "Starter",
      type: PlanType.FREE,
      price: 0,
      chatLimit: 100,
      tokenLimit: 50000,
    },
  });

  await prisma.plan.upsert({
    where: {
      type: PlanType.PRO,
    },
    update: {},
    create: {
      name: "Pro Studio",
      type: PlanType.PRO,
      price: 29,
      chatLimit: 100000,
      tokenLimit: 1500000,
    },
  });

  await prisma.plan.upsert({
    where: {
      type: PlanType.BUSINESS,
    },
    update: {},
    create: {
      name: "Enterprise",
      type: PlanType.BUSINESS,
      price: 99,
      chatLimit: 999999,
      tokenLimit: 5000000,
    },
  });

  console.log("✅ Plans seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
