/**
 * Restores the demo dataset. Safe to run repeatedly: it clears the mutations a
 * visitor can make (guest enquiries and saved listings) and then re-runs the
 * seed, which upserts every showcase row back to its canonical state.
 *
 *   npm run demo:reset
 *
 * Wire it to a nightly cron in the deployed environment; the HTTP equivalent is
 * POST /api/demo/reset with the `x-demo-reset-secret` header.
 */
import { config } from "dotenv";

config({ path: [".env.local", ".env"] });

async function reset() {
  const { default: prisma } = await import("../src/lib/prisma");
  const { main: seed } = await import("../prisma/seed");

  // Visitor-side mutations on showcase content.
  const guestInquiries = await prisma.inquiry.deleteMany({
    where: { buyerId: null, listing: { isDemo: true } },
  });

  const demoUserIds = await prisma.user.findMany({
    where: { isDemo: true },
    select: { id: true },
  });

  const demoSaves = await prisma.savedListing.deleteMany({
    where: { userId: { in: demoUserIds.map((user) => user.id) } },
  });

  console.log(
    `cleared ${guestInquiries.count} guest enquir${guestInquiries.count === 1 ? "y" : "ies"} and ${demoSaves.count} demo save${demoSaves.count === 1 ? "" : "s"}`,
  );

  await seed();

  const [listings, published, drafts, users] = await Promise.all([
    prisma.listing.count({ where: { isDemo: true } }),
    prisma.listing.count({ where: { isDemo: true, status: "PUBLISHED" } }),
    prisma.listing.count({ where: { isDemo: true, status: "DRAFT" } }),
    prisma.user.count({ where: { isDemo: true } }),
  ]);

  console.log(
    `demo data restored: ${listings} listings (${published} published, ${drafts} draft), ${users} demo accounts`,
  );

  await prisma.$disconnect();
}

reset().catch((error) => {
  console.error("Demo reset failed:", error);
  process.exitCode = 1;
});
