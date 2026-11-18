"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import prisma from "../prisma";

const listingStatuses = [
  "DRAFT",
  "PUBLISHED",
  "UNDER_OFFER",
  "SOLD",
  "RENTED",
  "ARCHIVED",
] as const;

type ListingStatus = (typeof listingStatuses)[number];

export type CreateListingState = {
  success?: string;
  error?: string;
} | null;


function getString(formData: FormData, key: string, fallback = "") {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function getNumber(formData: FormData, key: string) {
  const raw = getString(formData, key);
  if (!raw) return undefined;

  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
}

function getListingType(formData: FormData) {
  return getString(formData, "type") === "LAND" ? "LAND" : "HOUSE";
}

function getListingStatus(formData: FormData) {
  const status = getString(formData, "status", "DRAFT");
  return listingStatuses.includes(status as ListingStatus)
    ? (status as ListingStatus)
    : "DRAFT";
}

function createSlug(title: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${slug || "listing"}-${Date.now()}`;
}

export async function createListing(
  prevState: CreateListingState,
  formData: FormData
): Promise<CreateListingState> {
  const session = await requireAdmin();

  try {
    const title = getString(formData, "title", "Untitled property");

    const attributes: Record<string, string | number | boolean> = {
      negotiable: formData.get("negotiable") === "on",
    };

    for (const key of ["bedrooms", "bathrooms", "toilets", "parking"]) {
      const value = getNumber(formData, key);
      if (value !== undefined) {
        attributes[key] = value;
      }
    }

    for (const key of [
      "area",
      "landmark",
      "size",
      "sizeUnit",
      "yearBuilt",
      "transactionType",
    ]) {
      const value = getString(formData, key);
      if (value) {
        attributes[key] = value;
      }
    }

    const imageUrls = formData.getAll("imageUrls") as string[];
    const imagePublicIds = formData.getAll("imagePublicIds") as string[];

    const listing = await prisma.listing.create({
      data: {
        title,
        description: getString(formData, "description", `${title} description`),
        type: getListingType(formData),
        status: getListingStatus(formData),
        price: getNumber(formData, "price") ?? 0,
        currency: "NGN",
        address: getString(formData, "address", "Address unavailable"),
        city: getString(formData, "city", "City unavailable"),
        state: getString(formData, "state", "State unavailable"),
        country: "Nigeria",
        slug: createSlug(title),
        agentId: session.user.id,
        attributes,
      },
    });

    if (imageUrls.length > 0) {
      try {
        await prisma.listingImage.createMany({
          data: imageUrls.map((url, index) => ({
            listingId: listing.id,
            url,
            publicId: imagePublicIds[index] ?? "",
            order: index,
            isCover: index === 0,
          })),
        });
      } catch (error) {
        console.error("Failed to create listing images", error);
      }
    }

    revalidatePath("/admin/listings");
    revalidatePath("/");

    return { success: "Listing uploaded successfully" };
  } catch (error) {
    console.error("Failed to create listing", error);
    return { error: "Failed to upload listing. Please try again." };
  }
}
