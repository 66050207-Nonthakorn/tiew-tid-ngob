import { PrismaClient } from "../generated";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
})

process.on("beforeExit", async () => {
  await prisma.$disconnect();
})

export default prisma;