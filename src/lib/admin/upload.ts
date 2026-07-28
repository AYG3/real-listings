import prisma from "../prisma";
import { CreateListingInput } from "../types";

export async function createListing(input: CreateListingInput) {
    return await prisma.listing.create({
        data: {
              title: "checkers",
              description: "checkers description",
              type: "HOUSE",
              status: "DRAFT",
              price: 700,
              currency: "USD",
              address: "Checkers street",
              city: "NGN",
              state: "FCT",
              country: "NIGERIA",
              slug: "1",
              agentId: "checkers",
              attributes: {
                bedrooms: 6,
                bathrooms: 7
              },
        }
    })
}