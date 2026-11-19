import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/prisma/generated/client";

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

// Supabase's transaction pooler serves every tenant from one pool, so keep the
// per-process pool small; the default of 10 exhausts the connection budget
// during dev reloads and on serverless instances.
//
// Idle sockets are retired quickly on purpose: the pooler closes connections it
// considers idle, and a socket it closed looks healthy to `pg` until the next
// query fails with P1017. Requests that arrive after a gap pay a fresh
// handshake, which is why the read paths below batch their queries.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  keepAlive: true,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
});
const prisma =
 globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma