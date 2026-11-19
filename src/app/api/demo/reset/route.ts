import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Nightly demo reset over HTTP.
 *
 *   curl -X POST https://host/api/demo/reset -H "x-demo-reset-secret: $DEMO_RESET_SECRET"
 *
 * Refuses to run unless DEMO_MODE is on and the secret matches, so a deployed
 * instance cannot be wiped by guessing the URL.
 */
export async function POST(request: Request) {
  const secret = process.env.DEMO_RESET_SECRET;

  if (process.env.DEMO_MODE !== "true" || !secret) {
    return NextResponse.json(
      { ok: false, error: "Demo reset is not enabled on this deployment." },
      { status: 404 },
    );
  }

  if (request.headers.get("x-demo-reset-secret") !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const guestInquiries = await prisma.inquiry.deleteMany({
    where: { buyerId: null, listing: { isDemo: true } },
  });

  const demoUsers = await prisma.user.findMany({
    where: { isDemo: true },
    select: { id: true },
  });

  const demoSaves = await prisma.savedListing.deleteMany({
    where: { userId: { in: demoUsers.map((user) => user.id) } },
  });

  const [listings, published] = await Promise.all([
    prisma.listing.count({ where: { isDemo: true } }),
    prisma.listing.count({ where: { isDemo: true, status: "PUBLISHED" } }),
  ]);

  return NextResponse.json({
    ok: true,
    cleared: { inquiries: guestInquiries.count, saves: demoSaves.count },
    listings,
    published,
  });
}
