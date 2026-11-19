"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAgent } from "@/lib/auth/guards";
import { attachListingImages, readListingImages } from "@/lib/listing/images";
import prisma from "@/lib/prisma";
import { clearPublicCache } from "@/lib/listing/public-cache";
import { DEMO_READ_ONLY_MESSAGE, isDemoSessionUser } from "@/lib/demo/guard";
import {
  fieldErrorsOf,
  listingFormSchema,
  listingIdSchema,
  toListingAttributes,
} from "@/lib/validation";

export type UpdateListingState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function updateListing(
  listingId: string,
  _previous: UpdateListingState,
  formData: FormData,
): Promise<UpdateListingState> {
  const session = await requireAgent();

  if (isDemoSessionUser(session.user)) {
    return { status: "error", message: DEMO_READ_ONLY_MESSAGE };
  }

  const id = listingIdSchema.safeParse({ listingId });
  if (!id.success) {
    return { status: "error", message: "Listing not found." };
  }

  const existing = await prisma.listing.findFirst({
    where: { id: id.data.listingId, agentId: session.user.id },
    select: { id: true, slug: true },
  });

  if (!existing) {
    return { status: "error", message: "Listing not found." };
  }

  const parsed = listingFormSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors: fieldErrorsOf(parsed.error),
    };
  }

  const data = parsed.data;
  const attributes = toListingAttributes(data);

  await prisma.listing.update({
    where: { id: existing.id },
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      type: data.type,
      intent: data.transactionType === "sale" ? "SALE" : "RENT",
      state: data.state,
      city: data.city,
      address: data.address,
      attributes,
    },
  });

  const removedIds = formData
    .getAll("removedImageIds")
    .filter((value): value is string => typeof value === "string" && !!value);

  if (removedIds.length > 0) {
    await prisma.listingImage.deleteMany({
      where: { id: { in: removedIds }, listingId: existing.id },
    });
  }

  const orderedIds = formData
    .getAll("imageIds")
    .filter((value): value is string => typeof value === "string" && !!value);

  if (orderedIds.length > 0) {
    // Only rows that belong to this listing may be reordered or made the cover.
    const owned = await prisma.listingImage.findMany({
      where: { listingId: existing.id },
      select: { id: true },
    });
    const ownedIds = new Set(owned.map((image) => image.id));

    let position = 0;
    for (const id of orderedIds) {
      if (!ownedIds.has(id)) continue;
      await prisma.listingImage.update({
        where: { id },
        data: { order: position, isCover: position === 0 },
      });
      position += 1;
    }
  }

  const newImages = readListingImages(formData);
  if (newImages.length > 0) {
    const remaining = await prisma.listingImage.count({
      where: { listingId: existing.id },
    });

    await attachListingImages(
      existing.id,
      newImages.slice(0, Math.max(0, 12 - remaining)),
    );

    const cover = await prisma.listingImage.findFirst({
      where: { listingId: existing.id, isCover: true },
      select: { id: true },
    });
    if (!cover) {
      const first = await prisma.listingImage.findFirst({
        where: { listingId: existing.id },
        orderBy: { order: "asc" },
        select: { id: true },
      });
      if (first) {
        await prisma.listingImage.update({
          where: { id: first.id },
          data: { isCover: true },
        });
      }
    }
  }

  clearPublicCache("listing:");
  revalidatePath("/agent/listings");
  revalidatePath("/agent/dashboard");
  revalidatePath("/properties");
  revalidatePath(`/properties/${existing.slug}`);
  revalidatePath("/agents");

  redirect("/agent/listings?updated=1");
}
