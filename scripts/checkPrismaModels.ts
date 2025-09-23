// scripts/checkPrismaModels.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Available models in Prisma Client:");
  console.log(Object.keys(prisma));

  // Optional: check if 'playlist' exists
  if (!("playlist" in prisma)) {
    console.error("Error: 'playlist' model not found! Run `npx prisma generate`.");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
