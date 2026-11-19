import { MessageSquare } from "lucide-react";
import { requireAgent } from "@/lib/auth/guards";
import prisma from "@/lib/prisma";
import { formatRelativeTime } from "@/lib/format";
import { InquiryInbox } from "./_components/inquiry-inbox";
import type { InquiryRow } from "./_components/inquiry-data";

export default async function AgentEnquiriesPage() {
  const session = await requireAgent();

  const inquiries = await prisma.inquiry.findMany({
    where: { listing: { agentId: session.user.id } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      message: true,
      status: true,
      agentNote: true,
      createdAt: true,
      listing: { select: { id: true, title: true } },
    },
  });

  const rows: InquiryRow[] = inquiries.map((inquiry) => ({
    id: inquiry.id,
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    message: inquiry.message,
    status: inquiry.status,
    agentNote: inquiry.agentNote,
    listingTitle: inquiry.listing.title,
    listingId: inquiry.listing.id,
    age: formatRelativeTime(inquiry.createdAt),
  }));

  const unread = rows.filter((row) => row.status === "NEW").length;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-forest-700">
            Agent
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
            Enquiries
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-gray-500">
            Buyer enquiries for your listings only. Move each one along as you
            reply.
          </p>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">Total</p>
            <p className="mt-2 text-3xl font-bold text-gray-950">{rows.length}</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm">
            <p className="text-sm font-semibold text-emerald-800">Unread</p>
            <p className="mt-2 text-3xl font-bold text-forest-700">{unread}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">Scheduled viewings</p>
            <p className="mt-2 text-3xl font-bold text-gray-950">
              {rows.filter((row) => row.status === "VIEWING_SCHEDULED").length}
            </p>
          </div>
        </section>

        <section className="mt-8">
          {rows.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
              <MessageSquare
                className="mx-auto h-8 w-8 text-gray-400"
                aria-hidden="true"
              />
              <h2 className="mt-3 text-lg font-bold text-gray-950">
                No enquiries yet
              </h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
                When a buyer enquires about one of your published listings, the
                details land here. Publish a listing to start receiving them.
              </p>
            </div>
          ) : (
            <InquiryInbox inquiries={rows} />
          )}
        </section>
      </div>
    </div>
  );
}
