import path from "path"
import dotenv from "dotenv"
import type { PrismaConfig } from "prisma"

dotenv.config({ quiet: true });

export default {
  schema: path.join("prisma"),
} satisfies PrismaConfig