import prisma from '../prisma'

export async function adminGetListings() {
  return prisma.listing.findMany({
    include: {
      images: {
        orderBy: { order: "asc" },
      },
      agent: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getListingById(id: string) {
  return prisma.listing.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
      agent: {
        select: { name: true, email: true, phone: true },
      },
    },
  });
}



//adding filter
