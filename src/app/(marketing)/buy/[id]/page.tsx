type ListingDetailsPageProps = {
  params: Promise<{ id: string }>;
};

import prisma from "@/lib/prisma";

export default async function buy({ params }: ListingDetailsPageProps) {

    const {id } = await params;

    const listing = await prisma.listing.findUnique({
        where: { id }
    })

    console.log("Listing: ", listing)
    // return (
        // <div key={listing.id}>

        // </div>
    // )
}