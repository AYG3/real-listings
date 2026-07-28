//MUTATIONS FOR MAKING CHANGES TO DATA


// import prisma from "../prisma";
// import type { CreateListingInput, ListingStatusValue } from "./types";

// export async function createListing(input: CreateListingInput) {
//   return prisma.listing.create({
//     data: {
//       title: input.title,
//       description: input.description,
//       type: input.type,
//       status: input.status ?? "DRAFT",
//       price: input.price,
//       currency: input.currency ?? "NGN",
//       address: input.address,
//       city: input.city,
//       state: input.state,
//       country: input.country ?? "Nigeria",
//       slug: input.slug,
//       agentId: input.agentId,
//     //   attributes: input.attributes ?? {},
//     },
//   });
// }

// export async function updateListingStatus(id: string, status: ListingStatusValue) {
//   return prisma.listing.update({
//     where: { id },
//     data: { status },
//   });
// }