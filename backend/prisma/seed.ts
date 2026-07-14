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
    update: {
      name: "Starter",
      price: 0,
      monthlyCredits: 1_000,
      chatLimit: 100,
      imageLimit: 5,
      workspaceLimit: 1,
      uploadLimitMb: 10,
      features: {
        memory: false,
        analytics: false,
        imageGeneration: false,
        priorityQueue: false,
      },
    },
    create: {
      name: "Starter",
      type: PlanType.FREE,
      price: 0,
      monthlyCredits: 1_000,
      chatLimit: 100,
      imageLimit: 5,
      workspaceLimit: 1,
      uploadLimitMb: 10,
      features: {
        memory: false,
        analytics: false,
        imageGeneration: false,
        priorityQueue: false,
      },
    },
  });

  await prisma.plan.upsert({
    where: {
      type: PlanType.PRO,
    },
    update: {
      name: "Pro Studio",
      price: 99_000,
      monthlyCredits: 1_500_000,
      chatLimit: 100_000,
      imageLimit: 500,
      workspaceLimit: 100,
      uploadLimitMb: 100,
      features: {
        memory: true,
        analytics: true,
        imageGeneration: true,
        priorityQueue: true,
        exportChat: true,
      },
    },
    create: {
      name: "Pro Studio",
      type: PlanType.PRO,
      price: 99_000,
      monthlyCredits: 1_500_000,
      chatLimit: 100_000,
      imageLimit: 500,
      workspaceLimit: 100,
      uploadLimitMb: 100,
      features: {
        memory: true,
        analytics: true,
        imageGeneration: true,
        priorityQueue: true,
        exportChat: true,
      },
    },
  });

  await prisma.plan.upsert({
    where: {
      type: PlanType.BUSINESS,
    },
    update: {
      name: "Team",
      price: 399_000,
      monthlyCredits: 5_000_000,
      chatLimit: 999_999,
      imageLimit: 2_000,
      workspaceLimit: 500,
      uploadLimitMb: 500,
      features: {
        memory: true,
        analytics: true,
        imageGeneration: true,
        priorityQueue: true,
        exportChat: true,
        teamWorkspace: true,
        sharedCredits: true,
      },
    },
    create: {
      name: "Team",
      type: PlanType.BUSINESS,
      price: 399_000,
      monthlyCredits: 5_000_000,
      chatLimit: 999_999,
      imageLimit: 2_000,
      workspaceLimit: 500,
      uploadLimitMb: 500,
      features: {
        memory: true,
        analytics: true,
        imageGeneration: true,
        priorityQueue: true,
        exportChat: true,
        teamWorkspace: true,
        sharedCredits: true,
      },
    },
  });

  console.log("✅ Plans seeded successfully.");
}

main()
  .catch((error) => {
    console.error("❌ Failed to seed plans:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
