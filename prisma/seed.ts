import { config } from "dotenv";

import { showcaseAgents, showcaseListings } from "./seed-listings";

config({ path: [".env.local", ".env"] });

type SeedRole = "ADMIN" | "AGENT" | "BUYER";

type SeedAccount = {
  name: string;
  email: string;
  password: string;
  role: SeedRole;
  phone?: string;
};

const AGENT_PASSWORD = "AlaraAgent1!";

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
    password: AGENT_PASSWORD,
    role: "AGENT",
    phone: "+234 802 555 0100",
  },
  {
    name: "Alara Buyer",
    email: "buyer@alara.ng",
    password: "AlaraBuyer1!",
    role: "BUYER",
  },
];

const showcaseAccounts: SeedAccount[] = showcaseAgents.map((agent) => ({
  name: agent.name,
  email: agent.email,
  password: AGENT_PASSWORD,
  role: "AGENT",
  phone: agent.phone,
}));

async function main() {
  const { default: prisma } = await import("@/lib/prisma");
  const { auth } = await import("@/lib/auth/auth");

  for (const account of [...accounts, ...showcaseAccounts]) {
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
        ...(account.phone ? { phone: account.phone } : {}),
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

  // Showcase inventory. Listings upsert by slug and replace their images, so
  // running the seed again resets the demo content instead of duplicating it.
  const seedEpoch = new Date("2026-11-01T09:00:00.000Z").getTime();
  let seededListings = 0;

  for (const [index, item] of showcaseListings.entries()) {
    const agent = await prisma.user.findUnique({
      where: { email: item.agentEmail },
      select: { id: true },
    });

    if (!agent) {
      console.warn(`! Skipped ${item.slug}: no agent ${item.agentEmail}`);
      continue;
    }

    const data = {
      title: item.title,
      description: item.description,
      type: item.type,
      status: item.status,
      price: item.price,
      currency: "NGN",
      address: item.address,
      city: item.city,
      state: item.state,
      country: "Nigeria",
      attributes: item.attributes,
      agentId: agent.id,
      // Fixed timestamps keep ordering (and the seed) deterministic.
      createdAt: new Date(seedEpoch - index * 36 * 60 * 60 * 1000),
    };

    const listing = await prisma.listing.upsert({
      where: { slug: item.slug },
      update: data,
      create: { ...data, slug: item.slug },
    });

    await prisma.listingImage.deleteMany({ where: { listingId: listing.id } });
    await prisma.listingImage.createMany({
      data: item.photos.map((photo, position) => ({
        listingId: listing.id,
        url: `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1200&q=65`,
        publicId: `seed/${item.slug}/${position}`,
        order: position,
        isCover: position === 0,
      })),
    });

    seededListings += 1;
  }

  console.log(`✔ ${seededListings} showcase listings`);

  console.log("\nSeeded accounts (password is the same for local development):");
  for (const account of accounts) {
    console.log(
      `  ${account.role.padEnd(5)} ${account.email}  ${account.password}`,
    );
  }
  console.log(
    `  AGENT ${showcaseAgents.map((agent) => agent.email).join(", ")}  ${AGENT_PASSWORD}`,
  );

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});