/**
 * Showcase content for the demo. Kept separate from the seeding logic so the
 * dataset can be reviewed and extended without touching the mechanics.
 *
 * Accounts are idempotent by email and listings by slug, so re-running the seed
 * resets this content instead of duplicating it.
 */

export type ShowcaseAgent = {
  name: string;
  email: string;
  phone: string;
};

/** Owns the seeded listings alongside the primary `agent@alara.ng` account. */
export const showcaseAgents: ShowcaseAgent[] = [
  {
    name: "Chidi Okafor",
    email: "chidi@alara.ng",
    phone: "+234 803 555 0111",
  },
  {
    name: "Grace Adebayo",
    email: "grace@alara.ng",
    phone: "+234 805 555 0122",
  },
  {
    name: "Musa Bello",
    email: "musa@alara.ng",
    phone: "+234 807 555 0133",
  },
];

export type ShowcaseListing = {
  slug: string;
  title: string;
  description: string;
  type: "HOUSE" | "LAND";
  status: "PUBLISHED" | "DRAFT";
  price: number;
  address: string;
  city: string;
  state: string;
  agentEmail: string;
  attributes: Record<string, string | number | boolean>;
  /** Unsplash photo ids, reused across listings to keep the seed small. */
  photos: string[];
};

const LAGOS_AGENT = "agent@alara.ng";
const CHIDI = "chidi@alara.ng";
const GRACE = "grace@alara.ng";
const MUSA = "musa@alara.ng";

export const showcaseListings: ShowcaseListing[] = [
  {
    slug: "lekki-phase-1-4-bedroom-duplex",
    title: "4-bedroom duplex with a private garden",
    description:
      "A well-finished four-bedroom duplex on a quiet street in Lekki Phase 1, a short drive from Admiralty Way. All rooms are en-suite, with a fitted kitchen, family lounge, and staff quarters. The compound takes two cars comfortably and the garden is already landscaped. Power is backed up by an inverter and a shared generator. The estate has a resident association, gate security, and a working drainage system, which matters more than most people expect during the rainy season.",
    type: "HOUSE",
    status: "PUBLISHED",
    price: 185_000_000,
    address: "18 Fola Osibo Street",
    city: "Lekki",
    state: "Lagos",
    agentEmail: LAGOS_AGENT,
    attributes: {
      transactionType: "sale",
      bedrooms: 4,
      bathrooms: 4,
      toilets: 5,
      parking: 2,
      size: "420",
      sizeUnit: "sqm",
      yearBuilt: 2019,
      negotiable: true,
    },
    photos: [
      "photo-1564013799919-ab600027ffc6",
      "photo-1600585154340-be6161a56a0c",
      "photo-1600047509807-ba8f99d2cdde",
    ],
  },
  {
    slug: "ikoyi-3-bedroom-serviced-apartment",
    title: "Serviced 3-bedroom apartment in Ikoyi",
    description:
      "A serviced three-bedroom apartment on the third floor of a managed building in Ikoyi, available on a yearly let. Rent covers water treatment, common-area cleaning, and security. The apartment is fully air-conditioned, comes with a fitted kitchen and a small balcony off the living room, and the building has a lift plus a standby generator. Two parking spaces are assigned. The location is a ten-minute drive to Falomo and the Ikoyi link bridge, so the island commute is straightforward.",
    type: "HOUSE",
    status: "PUBLISHED",
    price: 12_000_000,
    address: "7 Glover Road",
    city: "Ikoyi",
    state: "Lagos",
    agentEmail: CHIDI,
    attributes: {
      transactionType: "rent",
      bedrooms: 3,
      bathrooms: 3,
      toilets: 4,
      parking: 2,
      size: "180",
      sizeUnit: "sqm",
      yearBuilt: 2016,
      negotiable: false,
    },
    photos: [
      "photo-1600585154340-be6161a56a0c",
      "photo-1600566753086-00f18fb6b3ea",
    ],
  },
  {
    slug: "ikeja-gra-5-bedroom-detached-house",
    title: "5-bedroom detached house in Ikeja GRA",
    description:
      "A detached family home on a full plot in Ikeja GRA, arranged over two floors with five bedrooms, a study, and a separate guest wing. The living areas are generous and open onto a covered terrace and a lawn that has room for a pool. There is a borehole, a 20kva generator in its own housing, and space for four cars behind the gate. GRA is quiet, tree-lined, and still close to the airport, which makes it a practical choice for families who travel.",
    type: "HOUSE",
    status: "PUBLISHED",
    price: 320_000_000,
    address: "42 Oduduwa Crescent",
    city: "Ikeja",
    state: "Lagos",
    agentEmail: GRACE,
    attributes: {
      transactionType: "sale",
      bedrooms: 5,
      bathrooms: 5,
      toilets: 6,
      parking: 4,
      size: "600",
      sizeUnit: "sqm",
      yearBuilt: 2014,
      negotiable: true,
    },
    photos: [
      "photo-1580587771525-78b9dba3b914",
      "photo-1600607687939-ce8a6c25118c",
      "photo-1605276374104-dee2a0ed3cd6",
    ],
  },
  {
    slug: "ajah-2-bedroom-flat-for-rent",
    title: "2-bedroom flat off the Lekki-Epe expressway",
    description:
      "A neat two-bedroom flat in a small block of six in Ajah, both rooms en-suite with fitted wardrobes. The kitchen is separate and the living room takes a dining table without crowding. Water runs from a treated borehole, the compound is gated, and there is one parking space. The estate sits about five minutes from the expressway and has a daily waste collection arrangement. Good fit for a small family or two professionals sharing, and the landlord is open to a two-year agreement.",
    type: "HOUSE",
    status: "PUBLISHED",
    price: 3_500_000,
    address: "5 Ogombo Road",
    city: "Ajah",
    state: "Lagos",
    agentEmail: MUSA,
    attributes: {
      transactionType: "rent",
      bedrooms: 2,
      bathrooms: 2,
      toilets: 3,
      parking: 1,
      size: "96",
      sizeUnit: "sqm",
      yearBuilt: 2020,
      negotiable: true,
    },
    photos: [
      "photo-1600607687939-ce8a6c25118c",
      "photo-1600047509807-ba8f99d2cdde",
    ],
  },
  {
    slug: "lekki-scheme-2-two-plots-of-land",
    title: "Two adjoining plots in Lekki Scheme 2",
    description:
      "Two adjoining plots totalling about 1,000 square metres in Lekki Scheme 2, sold together. The land is dry, fenced on two sides, and sits on a graded road with drainage. Title is a registered deed of assignment with a survey plan available on request. The area is largely built up, with occupied houses on both sides, so there is no waiting on infrastructure. Suitable for a family compound or a small development, subject to the scheme's building approval process.",
    type: "LAND",
    status: "PUBLISHED",
    price: 48_000_000,
    address: "Off Abraham Adesanya Estate",
    city: "Lekki",
    state: "Lagos",
    agentEmail: LAGOS_AGENT,
    attributes: {
      transactionType: "sale",
      sizeInPlots: 2,
      titleType: "Deed of assignment",
      surveyPlanAvailable: true,
      negotiable: true,
    },
    photos: [
      "photo-1500382017468-9049fed747ef",
    ],
  },
  {
    slug: "gwarinpa-4-bedroom-terrace-duplex",
    title: "4-bedroom terrace duplex in Gwarinpa",
    description:
      "A four-bedroom terrace duplex in a serviced part of Gwarinpa, with a boys' quarters and a small back garden. The ground floor holds the kitchen, a guest room, and an open living and dining area; three bedrooms are upstairs, all en-suite. The estate provides security at the gate and maintains the internal roads. Power is shared between the estate generator and the grid, and the inverter covers lights and fans. Schools, a market, and the Gwarinpa expressway are all within a short drive.",
    type: "HOUSE",
    status: "PUBLISHED",
    price: 115_000_000,
    address: "14 3rd Avenue, Gwarinpa Estate",
    city: "Abuja",
    state: "FCT",
    agentEmail: CHIDI,
    attributes: {
      transactionType: "sale",
      bedrooms: 4,
      bathrooms: 4,
      toilets: 5,
      parking: 3,
      size: "300",
      sizeUnit: "sqm",
      yearBuilt: 2017,
      negotiable: true,
    },
    photos: [
      "photo-1600596542815-ffad4c1539a9",
      "photo-1600566753086-00f18fb6b3ea",
      "photo-1600585154340-be6161a56a0c",
    ],
  },
  {
    slug: "maitama-5-bedroom-detached-mansion",
    title: "5-bedroom detached mansion in Maitama",
    description:
      "A substantial detached house in Maitama on a walled plot with mature trees and a paved forecourt. Five en-suite bedrooms, a wide formal living room, a family lounge, and a dining room that seats twelve. The kitchen has a separate service entrance and there is a two-room boys' quarters. Utilities are well covered: borehole, water treatment, and dual generators. Embassy row, the Transcorp Hilton, and the central business district are all within ten minutes, which is why the address holds its value.",
    type: "HOUSE",
    status: "PUBLISHED",
    price: 450_000_000,
    address: "11 Amazon Street",
    city: "Abuja",
    state: "FCT",
    agentEmail: GRACE,
    attributes: {
      transactionType: "sale",
      bedrooms: 5,
      bathrooms: 6,
      toilets: 7,
      parking: 5,
      size: "800",
      sizeUnit: "sqm",
      yearBuilt: 2011,
      negotiable: false,
    },
    photos: [
      "photo-1613490493576-7fde63acd811",
      "photo-1600047509807-ba8f99d2cdde",
      "photo-1600607687939-ce8a6c25118c",
    ],
  },
  {
    slug: "wuse-2-three-bedroom-flat-for-rent",
    title: "3-bedroom flat in Wuse 2",
    description:
      "A three-bedroom flat in a managed block in Wuse 2, walking distance from the Wuse market axis and a short drive to the city centre. All bedrooms are en-suite, the kitchen is fitted with a cooker and cabinets, and there is a dedicated store. The building has a lift, a standby generator, treated water, and uniformed security at the gate. Rent is payable yearly and covers service charge. It suits a family that wants to be central without paying Maitama prices.",
    type: "HOUSE",
    status: "PUBLISHED",
    price: 7_500_000,
    address: "9 Adetokunbo Ademola Crescent",
    city: "Abuja",
    state: "FCT",
    agentEmail: MUSA,
    attributes: {
      transactionType: "rent",
      bedrooms: 3,
      bathrooms: 3,
      toilets: 4,
      parking: 2,
      size: "150",
      sizeUnit: "sqm",
      yearBuilt: 2015,
      negotiable: true,
    },
    photos: [
      "photo-1600566753086-00f18fb6b3ea",
      "photo-1605276374104-dee2a0ed3cd6",
    ],
  },
  {
    slug: "kuje-five-plots-with-c-of-o",
    title: "Five plots with a Certificate of Occupancy",
    description:
      "Five contiguous plots in Kuje with a Certificate of Occupancy already perfected in the owner's name. The land is flat, currently cleared, and accessible by a laterite road that the community maintains. There is no fence yet, and the nearest built property is about 200 metres away. Power lines run along the access road. Because the C of O is in place, a buyer can proceed to building approval without repeating the title process, which is the main reason this parcel is priced above nearby plots.",
    type: "LAND",
    status: "PUBLISHED",
    price: 22_000_000,
    address: "Kuje Area Council",
    city: "Kuje",
    state: "FCT",
    agentEmail: LAGOS_AGENT,
    attributes: {
      transactionType: "sale",
      sizeInPlots: 5,
      titleType: "Certificate of Occupancy",
      surveyPlanAvailable: true,
      negotiable: true,
    },
    photos: [
      "photo-1500382017468-9049fed747ef",
    ],
  },
  {
    slug: "port-harcourt-old-gra-4-bedroom-duplex",
    title: "4-bedroom duplex in Old GRA, Port Harcourt",
    description:
      "A four-bedroom duplex on a quiet street in Old GRA, built in 2018 and still in excellent condition. The ground floor has a large living room, a dining area, a guest bedroom, and a kitchen with a pantry. Upstairs holds three en-suite bedrooms, including a master with a walk-in closet. The compound is paved, gated, and takes three cars. There is a borehole, a 15kva generator, and a small garden at the back. Old GRA remains central for offices and schools.",
    type: "HOUSE",
    status: "PUBLISHED",
    price: 130_000_000,
    address: "23 Evo Road",
    city: "Port Harcourt",
    state: "Rivers",
    agentEmail: CHIDI,
    attributes: {
      transactionType: "sale",
      bedrooms: 4,
      bathrooms: 4,
      toilets: 5,
      parking: 3,
      size: "350",
      sizeUnit: "sqm",
      yearBuilt: 2018,
      negotiable: true,
    },
    photos: [
      "photo-1512917774080-9991f1c4c750",
      "photo-1605276374104-dee2a0ed3cd6",
      "photo-1600566753086-00f18fb6b3ea",
    ],
  },
  {
    slug: "rumuokoro-3-bedroom-flat-for-rent",
    title: "3-bedroom flat in Rumuokoro",
    description:
      "A three-bedroom flat in a gated compound in Rumuokoro, close to the airport road and the Rumuokoro market. Two bedrooms are en-suite and the third shares a bathroom off the corridor. The kitchen is tiled with space for a cooker and fridge, and the living room has a small balcony. Water comes from a borehole, and the compound generator is shared between the four flats. Rent is annual, and the landlord asks for two years upfront. Suitable for a family or staff housing.",
    type: "HOUSE",
    status: "PUBLISHED",
    price: 2_800_000,
    address: "8 Rumuokoro Main Road",
    city: "Port Harcourt",
    state: "Rivers",
    agentEmail: MUSA,
    attributes: {
      transactionType: "rent",
      bedrooms: 3,
      bathrooms: 2,
      toilets: 3,
      parking: 1,
      size: "120",
      sizeUnit: "sqm",
      yearBuilt: 2012,
      negotiable: true,
    },
    photos: [
      "photo-1600047509807-ba8f99d2cdde",
      "photo-1600585154340-be6161a56a0c",
    ],
  },
  {
    slug: "ibadan-bodija-4-bedroom-duplex",
    title: "4-bedroom duplex in Bodija, Ibadan",
    description:
      "A four-bedroom duplex in a residential part of Bodija, on a plot with a walled garden and space for a small pool. The house has two living areas, a dining room, a fitted kitchen, and a store. All bedrooms are en-suite and the master has a dressing room. The neighbourhood is established, with schools, hospitals, and the Bodija market within easy reach, and the roads inside the estate are tarred. The property is owner-built rather than speculative, and it shows in the finishing.",
    type: "HOUSE",
    status: "PUBLISHED",
    price: 85_000_000,
    address: "17 Awolowo Avenue",
    city: "Ibadan",
    state: "Oyo",
    agentEmail: GRACE,
    attributes: {
      transactionType: "sale",
      bedrooms: 4,
      bathrooms: 4,
      toilets: 5,
      parking: 3,
      size: "380",
      sizeUnit: "sqm",
      yearBuilt: 2016,
      negotiable: true,
    },
    photos: [
      "photo-1570129477492-45c003edd2be",
      "photo-1600585154340-be6161a56a0c",
      "photo-1600047509807-ba8f99d2cdde",
    ],
  },
  {
    slug: "ibadan-jericho-three-plots",
    title: "Three plots in Jericho, Ibadan",
    description:
      "Three plots in a built-up part of Jericho, close to the government reservation area. The land is dry and level, with a low wall on the road frontage and mature trees at the back. Title is a registered survey with a deed of assignment; the family is selling because the children have moved abroad. Water and power are already on the street, and neighbours on both sides have built, so there is no uncertainty about access. Ideal for a retirement home or a small block of flats.",
    type: "LAND",
    status: "PUBLISHED",
    price: 15_000_000,
    address: "Off Onireke Street",
    city: "Ibadan",
    state: "Oyo",
    agentEmail: LAGOS_AGENT,
    attributes: {
      transactionType: "sale",
      sizeInPlots: 3,
      titleType: "Deed of assignment",
      surveyPlanAvailable: true,
      negotiable: true,
    },
    photos: [
      "photo-1500382017468-9049fed747ef",
    ],
  },
  {
    slug: "enugu-independence-layout-3-bedroom",
    title: "3-bedroom flat in Independence Layout",
    description:
      "A three-bedroom flat in Independence Layout, one of Enugu's quieter residential districts. The flat occupies the upper floor of a duplex, with a private staircase, a living room, a dining area, and a kitchen with cabinets. Two bedrooms are en-suite. There is a balcony off the living room and a shared laundry area at the back. The compound is fenced with a gate, parking for two cars, and a borehole. Shops, schools, and the Nike Lake road are close by.",
    type: "HOUSE",
    status: "PUBLISHED",
    price: 4_200_000,
    address: "6A Chime Avenue",
    city: "Enugu",
    state: "Enugu",
    agentEmail: CHIDI,
    attributes: {
      transactionType: "rent",
      bedrooms: 3,
      bathrooms: 3,
      toilets: 4,
      parking: 2,
      size: "160",
      sizeUnit: "sqm",
      yearBuilt: 2013,
      negotiable: false,
    },
    photos: [
      "photo-1605276374104-dee2a0ed3cd6",
      "photo-1600607687939-ce8a6c25118c",
    ],
  },
  {
    slug: "enugu-trans-ekulu-two-plots",
    title: "Two plots in Trans-Ekulu, Enugu",
    description:
      "Two plots in Trans-Ekulu on a tarred road with drainage, about ten minutes from the Enugu-Onitsha expressway. The land is level and cleared, with a survey plan available and a deed of assignment as title. Power lines pass the frontage and there is a borehole two compounds away. The immediate area is mixed residential, with completed homes on one side and undeveloped plots on the other, so it suits a buyer who wants to build now without paying for a fully developed estate.",
    type: "LAND",
    status: "PUBLISHED",
    price: 12_000_000,
    address: "Trans-Ekulu Layout",
    city: "Enugu",
    state: "Enugu",
    agentEmail: MUSA,
    attributes: {
      transactionType: "sale",
      sizeInPlots: 2,
      titleType: "Deed of assignment",
      surveyPlanAvailable: true,
      negotiable: true,
    },
    photos: [
      "photo-1500382017468-9049fed747ef",
    ],
  },
  {
    slug: "kano-nassarawa-gra-5-bedroom-house",
    title: "5-bedroom house in Nassarawa GRA, Kano",
    description:
      "A five-bedroom house in Nassarawa GRA, built for a family and maintained since. The ground floor has two reception rooms, a dining room, and a kitchen with a service yard; upstairs holds four en-suite bedrooms and a study. The compound is walled, with a gatehouse, parking for four cars, and a borehole. The GRA is central, with the Government House, schools, and the commercial district nearby. The house needs cosmetic updates, which is reflected in the asking price.",
    type: "HOUSE",
    status: "PUBLISHED",
    price: 95_000_000,
    address: "31 Nassarawa GRA",
    city: "Kano",
    state: "Kano",
    agentEmail: GRACE,
    attributes: {
      transactionType: "sale",
      bedrooms: 5,
      bathrooms: 5,
      toilets: 6,
      parking: 4,
      size: "700",
      sizeUnit: "sqm",
      yearBuilt: 2008,
      negotiable: true,
    },
    photos: [
      "photo-1564013799919-ab600027ffc6",
      "photo-1600607687939-ce8a6c25118c",
      "photo-1605276374104-dee2a0ed3cd6",
    ],
  },
  {
    slug: "lekki-chevron-3-bedroom-flat",
    title: "3-bedroom flat off Chevron Drive",
    description:
      "A three-bedroom flat in a small gated estate off Chevron Drive, available on a yearly let. All rooms are en-suite, the kitchen is fitted, and the living room opens onto a balcony. The estate has a gate, a shared generator, treated water, and parking for residents. It is a practical base for anyone working on the Lekki corridor, with the toll gate and Admiralty Way within a short drive. Photos of the interior will be added once the current tenant moves out.",
    type: "HOUSE",
    status: "DRAFT",
    price: 5_500_000,
    address: "4 Chevron Drive",
    city: "Lekki",
    state: "Lagos",
    agentEmail: LAGOS_AGENT,
    attributes: {
      transactionType: "rent",
      bedrooms: 3,
      bathrooms: 3,
      toilets: 4,
      parking: 2,
      size: "140",
      sizeUnit: "sqm",
      yearBuilt: 2015,
      negotiable: false,
    },
    photos: [
      "photo-1600585154340-be6161a56a0c",
      "photo-1600566753086-00f18fb6b3ea",
    ],
  },
  {
    slug: "abuja-lugbe-one-plot",
    title: "One plot in Lugbe, Abuja",
    description:
      "A single plot in Lugbe, close to the airport road and the Lugbe market. The land is flat and partly fenced, with a survey plan available. Title is a deed of assignment. Access is by a laterite road that becomes tarred about 300 metres away, and a few houses are already occupied on the street. This is a straightforward entry-level plot for someone who wants to build in stages, and the seller will consider a short payment plan with a signed agreement.",
    type: "LAND",
    status: "DRAFT",
    price: 9_500_000,
    address: "Lugbe District",
    city: "Abuja",
    state: "FCT",
    agentEmail: LAGOS_AGENT,
    attributes: {
      transactionType: "sale",
      sizeInPlots: 1,
      titleType: "Deed of assignment",
      surveyPlanAvailable: true,
      negotiable: true,
    },
    photos: [
      "photo-1500382017468-9049fed747ef",
    ],
  },
];
