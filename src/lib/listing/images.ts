import prisma from "@/lib/prisma";

export type ListingImageInput = { url: string; publicId: string };

/**
 * The Cloudinary widget submits one hidden input per uploaded image. URLs and
 * public ids are independent fields, so they are paired by position.
 */
export function readListingImages(formData: FormData): ListingImageInput[] {
  const urls = formData
    .getAll("imageUrls")
    .filter((value): value is string => typeof value === "string" && !!value);

  const publicIds = formData.getAll("imagePublicIds");

  return urls.map((url, index) => {
    const publicId = publicIds[index];
    return {
      url,
      publicId: typeof publicId === "string" ? publicId : "",
    };
  });
}

/** Ordered exactly as uploaded; the first image becomes the cover. */
export async function attachListingImages(
  listingId: string,
  images: ListingImageInput[],
): Promise<number> {
  if (images.length === 0) return 0;

  try {
    await prisma.listingImage.createMany({
      data: images.map((image, index) => ({
        listingId,
        url: image.url,
        publicId: image.publicId,
        order: index,
        isCover: index === 0,
      })),
    });

    return images.length;
  } catch (error) {
    console.error("Failed to attach listing images", error);
    return 0;
  }
}
