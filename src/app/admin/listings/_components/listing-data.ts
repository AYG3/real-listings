export type ListingStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "UNDER_OFFER"
  | "SOLD"
  | "RENTED"
  | "ARCHIVED";
export type ListingType = "HOUSE" | "LAND";

export type AdminListing = {
  id: string;
  title: string;
  type: ListingType;
  status: ListingStatus;
  price: string;
  city: string;
  state: string;
  address: string;
  agent: string;
  submittedAt: string;
  publishedAt?: string;
  bedrooms?: number;
  bathrooms?: number;
  size: string;
  coverTone: "green" | "amber" | "rose" | "gray";
  description: string;
  amenities: string[];
  images?: { url: string }[];
};

export const listings: AdminListing[] = [
  {
    id: "3-bed-duplex-gwarinpa",
    title: "3-bed duplex, Gwarinpa",
    type: "HOUSE",
    status: "DRAFT",
    price: "₦85,000,000",
    city: "Abuja",
    state: "FCT",
    address: "Gwarinpa Estate, Abuja",
    agent: "Chidi Okafor",
    submittedAt: "2h ago",
    bedrooms: 3,
    bathrooms: 4,
    size: "420 sqm",
    coverTone: "amber",
    description:
      "A newly submitted duplex with family-sized rooms, secure parking, and a quiet estate location.",
    amenities: ["Secure estate", "Parking", "Water supply", "Fitted kitchen"],
  },
  {
    id: "land-parcel-karu",
    title: "Land parcel, Karu",
    type: "LAND",
    status: "DRAFT",
    price: "₦12,000,000",
    city: "Abuja",
    state: "FCT",
    address: "Karu District, Abuja",
    agent: "Musa Bello",
    submittedAt: "1d ago",
    size: "600 sqm",
    coverTone: "amber",
    description:
      "Residential land parcel submitted for review with survey documentation attached.",
    amenities: ["Survey plan", "Residential zoning", "Road access"],
  },
  {
    id: "2-bed-flat-lekki-phase-1",
    title: "2-bed flat, Lekki Phase 1",
    type: "HOUSE",
    status: "DRAFT",
    price: "₦45,000,000",
    city: "Lagos",
    state: "Lagos",
    address: "Lekki Phase 1, Lagos",
    agent: "Funmi Adebayo",
    submittedAt: "1d ago",
    bedrooms: 2,
    bathrooms: 2,
    size: "130 sqm",
    coverTone: "gray",
    description:
      "Compact apartment close to major roads, shops, and short-let demand corridors.",
    amenities: ["Balcony", "Security", "Generator", "Parking"],
  },
  {
    id: "4-bed-detached-port-harcourt-gra",
    title: "4-bed detached, Port Harcourt GRA",
    type: "HOUSE",
    status: "DRAFT",
    price: "₦120,000,000",
    city: "Port Harcourt",
    state: "Rivers",
    address: "Old GRA, Port Harcourt",
    agent: "Blessing Nnamdi",
    submittedAt: "2d ago",
    bedrooms: 4,
    bathrooms: 5,
    size: "510 sqm",
    coverTone: "amber",
    description:
      "Detached home in a premium residential area with multiple living spaces and private compound.",
    amenities: ["Private compound", "BQ", "Parking", "Security"],
  },
  {
    id: "5-bed-villa-asokoro",
    title: "5-bed villa, Asokoro",
    type: "HOUSE",
    status: "PUBLISHED",
    price: "₦250,000,000",
    city: "Abuja",
    state: "FCT",
    address: "Asokoro, Abuja",
    agent: "Ada Lawal",
    submittedAt: "Jun 22",
    publishedAt: "Jun 23",
    bedrooms: 5,
    bathrooms: 6,
    size: "780 sqm",
    coverTone: "green",
    description:
      "Premium villa with generous reception areas, landscaped outdoor space, and secure access.",
    amenities: ["Pool", "Garden", "Smart access", "BQ"],
  },
  {
    id: "commercial-plot-ikeja",
    title: "Commercial plot, Ikeja",
    type: "LAND",
    status: "ARCHIVED",
    price: "₦95,000,000",
    city: "Ikeja",
    state: "Lagos",
    address: "Alausa, Ikeja",
    agent: "Kemi Olaitan",
    submittedAt: "Jul 14",
    size: "900 sqm",
    coverTone: "rose",
    description:
      "Commercial plot flagged for document mismatch between uploaded title and submitted location.",
    amenities: ["Road frontage", "Commercial zoning", "Title review needed"],
  },
  {
    id: "3-bed-terrace-ibadan",
    title: "3-bed terrace, Ibadan",
    type: "HOUSE",
    status: "PUBLISHED",
    price: "₦38,000,000",
    city: "Ibadan",
    state: "Oyo",
    address: "Bodija, Ibadan",
    agent: "Tunde Bakare",
    submittedAt: "May 11",
    publishedAt: "May 12",
    bedrooms: 3,
    bathrooms: 3,
    size: "260 sqm",
    coverTone: "green",
    description:
      "Modern terrace home in a calm neighborhood with good road links and essential services.",
    amenities: ["Parking", "Security", "Water supply"],
  },
];

export const pendingListings = listings.filter(
  (listing) => listing.status === "DRAFT",
);
