import prisma from '../prisma'

export async function adminGetListings() {
    prisma.listing.findMany({
        where: {},
        select: {}
    })
}


//adding filter
