import { BadgeCheck, ShieldQuestion } from "lucide-react";
import { requireAgent } from "@/lib/auth/guards";
import prisma from "@/lib/prisma";
import { initials } from "@/lib/format";
import { ProfileForm } from "./_components/profile-form";

const statusCopy: Record<string, { label: string; tone: "success" | "warning"; body: string }> = {
  VERIFIED: {
    label: "Verified",
    tone: "success",
    body: "Your listings can be published straight away and your profile shows the verified badge.",
  },
  PENDING: {
    label: "Verification pending",
    tone: "warning",
    body: "An admin still has to approve your account. Until then, listings you submit wait in review.",
  },
  REJECTED: {
    label: "Verification rejected",
    tone: "warning",
    body: "An admin rejected the last verification attempt. Update your details and contact support.",
  },
  SUSPENDED: {
    label: "Suspended",
    tone: "warning",
    body: "Your account is suspended, so your listings are not visible publicly.",
  },
};

export default async function ProfilePage() {
  const session = await requireAgent();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      image: true,
      agencyName: true,
      bio: true,
      agentStatus: true,
      verifiedAt: true,
      _count: { select: { listings: true } },
    },
  });

  if (!user) return null;

  const status = statusCopy[user.agentStatus ?? "PENDING"] ?? statusCopy.PENDING;
  const StatusIcon = status.tone === "success" ? BadgeCheck : ShieldQuestion;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6">
          <p className="hidden text-sm font-semibold uppercase tracking-[0.16em] text-forest-700 lg:block">
            Agent
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
            Profile
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-500">
            Manage the details buyers see on your public agent page.
          </p>
        </header>

        <div
          className={`mb-6 flex flex-wrap items-center gap-3 rounded-lg border p-4 ${
            status.tone === "success"
              ? "border-emerald-200 bg-emerald-50/70"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <StatusIcon
            className={`h-5 w-5 ${status.tone === "success" ? "text-forest-700" : "text-amber-700"}`}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-950">{status.label}</p>
            <p className="text-sm text-gray-600">{status.body}</p>
          </div>
          <p className="ml-auto text-xs font-semibold text-gray-500">
            {user._count.listings} listing{user._count.listings === 1 ? "" : "s"}
          </p>
        </div>

        <ProfileForm
          defaults={{
            name: user.name,
            email: user.email,
            phone: user.phone ?? "",
            agencyName: user.agencyName ?? "",
            bio: user.bio ?? "",
            image: user.image,
            initials: initials(user.name),
          }}
        />
      </div>
    </div>
  );
}
