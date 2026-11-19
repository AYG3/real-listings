"use server";

import { revalidatePath } from "next/cache";
import { requireAgent } from "@/lib/auth/guards";
import prisma from "@/lib/prisma";
import { DEMO_READ_ONLY_MESSAGE, isDemoSessionUser } from "@/lib/demo/guard";
import { inquiryUpdateSchema } from "@/lib/validation";

export type InquiryActionResult = { status: "success" | "error"; message: string };

const labels: Record<string, string> = {
  NEW: "Moved back to new.",
  CONTACTED: "Marked as contacted.",
  VIEWING_SCHEDULED: "Viewing scheduled.",
  CLOSED: "Enquiry closed.",
};

/**
 * Status and note are scoped through the listing's owner, so an agent can only
 * touch inquiries on their own listings.
 */
export async function updateInquiry(
  inquiryId: string,
  status: string,
  note?: string,
): Promise<InquiryActionResult> {
  const parsed = inquiryUpdateSchema.safeParse({ inquiryId, status, note });

  if (!parsed.success) {
    return { status: "error", message: "That update is not valid." };
  }

  const session = await requireAgent();

  if (isDemoSessionUser(session.user)) {
    return { status: "error", message: DEMO_READ_ONLY_MESSAGE };
  }

  const inquiry = await prisma.inquiry.findFirst({
    where: { id: parsed.data.inquiryId, listing: { agentId: session.user.id } },
    select: { id: true, status: true },
  });

  if (!inquiry) {
    return { status: "error", message: "Enquiry not found." };
  }

  const trimmedNote = parsed.data.note?.trim();

  await prisma.inquiry.update({
    where: { id: inquiry.id },
    data: {
      status: parsed.data.status,
      agentNote: trimmedNote ? trimmedNote : undefined,
      lastContactedAt:
        parsed.data.status === "NEW" ? undefined : new Date(),
    },
  });

  revalidatePath("/agent/enquiries");
  revalidatePath("/agent/dashboard");

  return {
    status: "success",
    message: labels[parsed.data.status] ?? "Enquiry updated.",
  };
}
