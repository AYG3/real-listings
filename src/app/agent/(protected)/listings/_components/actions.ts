"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAgent } from "@/lib/auth/guards";
import { attachListingImages, readListingImages } from "@/lib/listing/images";
import prisma from "@/lib/prisma";

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

function createSlug(title: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${slug || "listing"}-${Date.now()}`;
}

export async function createListing(formData: FormData) {
  const session = await requireAgent();

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

  // Agent submissions always enter moderation as drafts; the client cannot
  // promote a listing to PUBLISHED from this form.
  const listing = await prisma.listing.create({
    data: {
      title,
      description: getString(formData, "description", `${title} description`),
      type: getListingType(formData),
      status: "DRAFT",
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

  await attachListingImages(listing.id, readListingImages(formData));

  revalidatePath("/agent/listings");
  revalidatePath("/properties");
  revalidatePath("/agents");
  redirect("/agent/listings?created=1");
}
