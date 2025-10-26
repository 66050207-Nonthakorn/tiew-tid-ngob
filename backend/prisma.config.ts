import path from "path"
import dotenv from "dotenv"
import type { PrismaConfig } from "prisma"

dotenv.config();

export default {
  schema: path.join("prisma"),
} satisfies PrismaConfig