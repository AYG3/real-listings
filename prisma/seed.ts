import { config } from "dotenv";

config({ path: [".env.local", ".env"] });

type SeedRole = "ADMIN" | "AGENT" | "BUYER";

type SeedAccount = {
  name: string;
  email: string;
  password: string;
  role: SeedRole;
};

const accounts: SeedAccount[] = [
  {
    name: "Alara Admin",
    email: "admin@alara.ng",
    password: "AlaraAdmin1!",
    role: "ADMIN",
  },
  {
    name: "Alara Agent",
    email: "agent@alara.ng",
    password: "AlaraAgent1!",
    role: "AGENT",
  },
  {
    name: "Alara Buyer",
    email: "buyer@alara.ng",
    password: "AlaraBuyer1!",
    role: "BUYER",
  },
];

async function main() {
  const { default: prisma } = await import("@/lib/prisma");
  const { auth } = await import("@/lib/auth/auth");

  for (const account of accounts) {
    const existing = await prisma.user.findUnique({
      where: { email: account.email },
    });

    if (!existing) {
      // Better Auth owns password hashing, so accounts are created through it
      // and promoted to their role afterwards (role is `input: false`).
      await auth.api.signUpEmail({
        body: {
          name: account.name,
          email: account.email,
          password: account.password,
        },
      });
    }

    await prisma.user.update({
      where: { email: account.email },
      data: {
        name: account.name,
        role: account.role,
        emailVerified: true,
      },
    });

    console.log(`✔ ${account.role.padEnd(5)} ${account.email}`);
  }

  // Keep the original local admin usable after the role model change.
  const legacyAdmin = await prisma.user.findUnique({
    where: { email: "admin@gmail.com" },
  });

  if (legacyAdmin) {
    await prisma.user.update({
      where: { id: legacyAdmin.id },
      data: { role: "ADMIN", emailVerified: true },
    });
    console.log("✔ Promoted existing admin@gmail.com to ADMIN");
  }

  console.log("\nSeeded accounts (password is the same for local development):");
  for (const account of accounts) {
    console.log(
      `  ${account.role.padEnd(5)} ${account.email}  ${account.password}`,
    );
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});