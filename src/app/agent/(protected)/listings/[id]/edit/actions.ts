"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAgent } from "@/lib/auth/guards";
import { attachListingImages, readListingImages } from "@/lib/listing/images";
import prisma from "@/lib/prisma";

export type UpdateListingState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

const listingSchema = z.object({
  title: z.string().trim().min(4, "Give the listing a title").max(160),
  description: z
    .string()
    .trim()
    .min(20, "Describe the property in at least 20 characters")
    .max(4000),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  type: z.enum(["HOUSE", "LAND"]),
  transactionType: z.enum(["sale", "rent", "short-let"]),
  state: z.string().trim().min(2, "State is required").max(80),
  city: z.string().trim().min(2, "City is required").max(80),
  area: z.string().trim().max(120).optional(),
  landmark: z.string().trim().max(160).optional(),
  address: z.string().trim().min(4, "Street address is required").max(240),
  negotiable: z.boolean(),
  bedrooms: z.coerce.number().int().min(0).max(50).optional(),
  bathrooms: z.coerce.number().int().min(0).max(50).optional(),
  toilets: z.coerce.number().int().min(0).max(50).optional(),
  parking: z.coerce.number().int().min(0).max(50).optional(),
  size: z.string().trim().max(40).optional(),
  sizeUnit: z.string().trim().max(20).optional(),
  yearBuilt: z.string().trim().max(10).optional(),
});

function optionalNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function optionalText(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export async function updateListing(
  listingId: string,
  _previous: UpdateListingState,
  formData: FormData,
): Promise<UpdateListingState> {
  const session = await requireAgent();

  const existing = await prisma.listing.findFirst({
    where: { id: listingId, agentId: session.user.id },
    select: { id: true, slug: true },
  });

  if (!existing) {
    return { status: "error", message: "Listing not found." };
  }

  const purpose = formData.get("transactionType");

  const parsed = listingSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    type: formData.get("type") === "LAND" ? "LAND" : "HOUSE",
    transactionType:
      purpose === "rent" || purpose === "short-let" ? purpose : "sale",
    state: formData.get("state"),
    city: formData.get("city"),
    area: optionalText(formData.get("area")),
    landmark: optionalText(formData.get("landmark")),
    address: formData.get("address"),
    negotiable: formData.get("negotiable") === "on",
    bedrooms: optionalNumber(formData.get("bedrooms")),
    bathrooms: optionalNumber(formData.get("bathrooms")),
    toilets: optionalNumber(formData.get("toilets")),
    parking: optionalNumber(formData.get("parking")),
    size: optionalText(formData.get("size")),
    sizeUnit: optionalText(formData.get("sizeUnit")),
    yearBuilt: optionalText(formData.get("yearBuilt")),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }

    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors,
    };
  }

  const data = parsed.data;

  const attributes: Record<string, string | number | boolean> = {
    negotiable: data.negotiable,
    transactionType: data.transactionType,
  };
  for (const key of ["bedrooms", "bathrooms", "toilets", "parking"] as const) {
    if (data[key] !== undefined) attributes[key] = data[key];
  }
  for (const key of [
    "area",
    "landmark",
    "size",
    "sizeUnit",
    "yearBuilt",
  ] as const) {
    if (data[key]) attributes[key] = data[key];
  }

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

  revalidatePath("/agent/listings");
  revalidatePath("/agent/dashboard");
  revalidatePath("/properties");
  revalidatePath(`/properties/${existing.slug}`);
  revalidatePath("/agents");

  redirect("/agent/listings?updated=1");
}
