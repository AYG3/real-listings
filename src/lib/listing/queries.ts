//QUERIES FOR READING DATA


// import prisma from "../prisma";

// export async function getPublishedListings({}){
//     return prisma.listing.findMany({
//         where: {
//             status: "PUBLISHED",
//             type: "HOUSE",
//         },
//         include: {
//             images: {
//                 where: {isCover: true}
//             }
            
//         }
//     })
// }