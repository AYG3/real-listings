import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/prisma/generated/client";

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

// Supabase's transaction pooler serves every tenant from one pool, so keep the
// per-process pool small; the default of 10 exhausts the connection budget
// during dev reloads and on serverless instances.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});
const prisma =
 globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma