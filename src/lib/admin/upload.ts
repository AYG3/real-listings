"use server";

import { revalidatePath } from "next/cache";
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

function getString(formData: FormData, key: string, fallback = "") {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function getNumber(formData: FormData, key: string) {
  const value = Number(getString(formData, key));
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

export async function createListing(formData: FormData) {
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

  //TEMP TESTING
  const agent: any = await prisma.user.findFirst();           // ← ADD
  

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
      // agentId: getString(formData, "agentId", "checkers"),
      agentId: agent.id ?? "",
      attributes,
    },
  });

  // NEW: create image records
  if (imageUrls.length > 0) {
    await prisma.listingImage.createMany({
      data: imageUrls.map((url, i) => ({
        listingId: listing.id,
        url,
        publicId: imagePublicIds[i] ?? "",
        order: i,
        isCover: i === 0,
      })),
    });
  }

  revalidatePath("/admin/listings");
}
