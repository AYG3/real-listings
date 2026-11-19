"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAgent } from "@/lib/auth/guards";
import { attachListingImages, readListingImages } from "@/lib/listing/images";
import { createListingSlug } from "@/lib/format";
import prisma from "@/lib/prisma";
import { clearPublicCache } from "@/lib/listing/public-cache";
import { DEMO_READ_ONLY_MESSAGE, isDemoSessionUser } from "@/lib/demo/guard";
import {
  fieldErrorsOf,
  listingFormSchema,
  toListingAttributes,
  type FormState,
} from "@/lib/validation";

export type CreateListingState = FormState;

export async function createListing(
  _previous: CreateListingState,
  formData: FormData,
): Promise<CreateListingState> {
  const session = await requireAgent();

  if (isDemoSessionUser(session.user)) {
    return { status: "error", message: DEMO_READ_ONLY_MESSAGE };
  }

  const parsed = listingFormSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors: fieldErrorsOf(parsed.error),
    };
  }

  const data = parsed.data;

  // Agent submissions always enter moderation as drafts; the client cannot
  // promote a listing to PUBLISHED from this form.
  const listing = await prisma.listing.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      status: "DRAFT",
      intent: data.transactionType === "sale" ? "SALE" : "RENT",
      price: data.price,
      currency: "NGN",
      address: data.address,
      city: data.city,
      state: data.state,
      country: "Nigeria",
      slug: createListingSlug(data.title),
      agentId: session.user.id,
      attributes: toListingAttributes(data),
    },
  });

  await attachListingImages(listing.id, readListingImages(formData));

  clearPublicCache("listing:");
  revalidatePath("/agent/listings");
  revalidatePath("/properties");
  revalidatePath("/agents");
  redirect("/agent/listings?created=1");
}
