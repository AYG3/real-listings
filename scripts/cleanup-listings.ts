/**
 * One-off data tidy. Early manual testing left rows with test values — a ₦12
 * listing titled "s", a row with 12 bathrooms and the city "Lent", a plot sized
 * "901002" — and two of them were published, so they showed up in the public
 * catalogue. This rewrites those rows to realistic Nigerian market data.
 *
 * Values are edited in place; nothing is deleted. Run once:
 *
 *   npx tsx scripts/cleanup-listings.ts
 */
import { config } from "dotenv";

config({ path: [".env.local", ".env"] });

const { default: prisma } = await import("../src/lib/prisma");

type Fix = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  city: string;
  state: string;
  address: string;
  attributes: Record<string, string | number | boolean>;
};

const FIXES: Fix[] = [
  {
    id: "cmsg60oku0002ubrib64m8ro1",
    title: "2-bedroom flat in Diobu, Port Harcourt",
    slug: "port-harcourt-diobu-2-bedroom-flat",
    description:
      "A ground-floor flat off Ikwerre Road with two bedrooms, a shared bathroom, and a kitchen that opens onto a small yard. The compound is gated and the landlord lives on site. Walking distance to Mile 3 market and the bus stop.",
    price: 11_500_000,
    city: "Port Harcourt",
    state: "Rivers",
    address: "23 Ikwerre Road, Diobu",
    attributes: {
      transactionType: "sale",
      bedrooms: 2,
      bathrooms: 2,
      toilets: 2,
      parking: 1,
      size: "88",
      sizeUnit: "sqm",
      yearBuilt: "2012",
      negotiable: true,
    },
  },
  {
    id: "cmsg61pov0003ubrin1m0woij",
    title: "3-bedroom flat in Rumuola, Port Harcourt",
    slug: "port-harcourt-rumuola-3-bedroom-flat",
    description:
      "A three-bedroom flat on the second floor of a small block, close to Rumuola junction. One en-suite bedroom, a family bathroom, a sitting room with a balcony, and a kitchen with fitted cabinets. The estate has a borehole and a shared generator.",
    price: 14_000_000,
    city: "Port Harcourt",
    state: "Rivers",
    address: "18 Rumuola Road",
    attributes: {
      transactionType: "sale",
      bedrooms: 3,
      bathrooms: 3,
      toilets: 3,
      parking: 2,
      size: "140",
      sizeUnit: "sqm",
      yearBuilt: "2015",
      negotiable: true,
    },
  },
  {
    id: "cmsko8e2k00008nriq2d9jv5g",
    title: "4-bedroom flat in Rumuomasi, Port Harcourt",
    slug: "port-harcourt-rumuomasi-4-bedroom-flat",
    description:
      "A four-bedroom flat in a quiet part of Rumuomasi, with two en-suite rooms, a large sitting room, and a kitchen with a separate store. The block is fenced with a gate and has parking for two cars in front.",
    price: 22_500_000,
    city: "Port Harcourt",
    state: "Rivers",
    address: "31 Rumuomasi Road",
    attributes: {
      transactionType: "sale",
      bedrooms: 4,
      bathrooms: 4,
      toilets: 5,
      parking: 2,
      size: "190",
      sizeUnit: "sqm",
      yearBuilt: "2009",
      negotiable: true,
    },
  },
  {
    id: "cmsko9sj200018nriifgkd7wq",
    title: "4-bedroom duplex in GRA Phase 2, Port Harcourt",
    slug: "port-harcourt-gra-phase-2-4-bedroom-duplex",
    description:
      "A four-bedroom duplex on a quiet street in old GRA, five minutes from Aggrey Road. All rooms are en-suite, there is a fitted kitchen with a store, a family lounge upstairs, and a small garden at the back. The compound has a generator house and space for two cars.",
    price: 48_000_000,
    city: "Port Harcourt",
    state: "Rivers",
    address: "12 Evo Road, GRA Phase 2",
    attributes: {
      transactionType: "sale",
      bedrooms: 4,
      bathrooms: 4,
      toilets: 5,
      parking: 2,
      size: "240",
      sizeUnit: "sqm",
      yearBuilt: "2009",
      negotiable: true,
    },
  },
  {
    id: "cmskp9ir800028nriecbedgql",
    title: "3-bedroom bungalow in Rumuokoro, Port Harcourt",
    slug: "port-harcourt-rumuokoro-3-bedroom-bungalow",
    description:
      "A well-kept bungalow off Ada George Road with three bedrooms, a sitting room that opens onto a covered veranda, and a separate boys' quarters. The compound is fenced with a gate, and a borehole means no water bills.",
    price: 16_500_000,
    city: "Port Harcourt",
    state: "Rivers",
    address: "7 Ada George Road, Rumuokoro",
    attributes: {
      transactionType: "sale",
      bedrooms: 3,
      bathrooms: 3,
      toilets: 4,
      parking: 2,
      size: "180",
      sizeUnit: "sqm",
      yearBuilt: "2001",
      negotiable: true,
    },
  },
  {
    id: "cmsn56zow0000apriymkm4ydk",
    title: "2-bedroom flat in Woji, Port Harcourt",
    slug: "port-harcourt-woji-2-bedroom-flat",
    description:
      "A first-floor flat in a block of four, walking distance from Woji market. Two bedrooms, one shared bathroom, a kitchen with space for a dining table, and a balcony off the sitting room. Suits a young couple or a small family.",
    price: 9_800_000,
    city: "Port Harcourt",
    state: "Rivers",
    address: "5 Woji Road",
    attributes: {
      transactionType: "sale",
      bedrooms: 2,
      bathrooms: 2,
      toilets: 2,
      parking: 1,
      size: "96",
      sizeUnit: "sqm",
      yearBuilt: "2011",
      negotiable: true,
    },
  },
  {
    id: "cmsn99ef00001apricvdtn5e8",
    title: "3-bedroom bungalow in Ikorodu, Lagos",
    slug: "lagos-ikorodu-3-bedroom-bungalow",
    description:
      "A three-bedroom bungalow on a tarred street off Ijede Road, with a sitting room, a separate dining area, and a kitchen with a back door onto the yard. The plot is fenced on three sides and there is room to extend at the back.",
    price: 28_000_000,
    city: "Ikorodu",
    state: "Lagos",
    address: "22 Ijede Road, Ikorodu",
    attributes: {
      transactionType: "sale",
      bedrooms: 3,
      bathrooms: 3,
      toilets: 3,
      parking: 2,
      size: "150",
      sizeUnit: "sqm",
      yearBuilt: "2010",
      negotiable: true,
    },
  },
  {
    id: "cmsn9qg250004apri9j2w66wv",
    title: "5-bedroom detached mansion in Asokoro, Abuja",
    slug: "abuja-asokoro-5-bedroom-detached-mansion",
    description:
      "A detached mansion on a corner plot in Asokoro with a gatehouse, a paved compound that holds six cars, and a landscaped garden. Five en-suite bedrooms upstairs, a guest wing downstairs, a family lounge, a study, and staff quarters at the back.",
    price: 420_000_000,
    city: "Abuja",
    state: "FCT",
    address: "Plot 1146 Yakubu Gowon Crescent, Asokoro",
    attributes: {
      transactionType: "sale",
      bedrooms: 5,
      bathrooms: 5,
      toilets: 6,
      parking: 6,
      size: "780",
      sizeUnit: "sqm",
      yearBuilt: "2014",
      negotiable: true,
    },
  },
  {
    id: "cmsn9si940005apri22vujklc",
    title: "4-bedroom terrace in Chevron Drive, Lekki",
    slug: "lekki-chevron-drive-4-bedroom-terrace",
    description:
      "A mid-terrace house in a serviced estate off Chevron Drive. Four en-suite bedrooms, a staff room, a fitted kitchen, and a small private yard. The estate provides water, a shared generator, and 24-hour security at the gate.",
    price: 98_000_000,
    city: "Lekki",
    state: "Lagos",
    address: "14 Chevron Drive, Lekki",
    attributes: {
      transactionType: "sale",
      bedrooms: 4,
      bathrooms: 4,
      toilets: 5,
      parking: 3,
      size: "260",
      sizeUnit: "sqm",
      yearBuilt: "2018",
      negotiable: true,
    },
  },
  {
    id: "cmul9x2500000curilqlp01yt",
    title: "3-bedroom storey building in Garki, Abuja",
    slug: "abuja-garki-3-bedroom-storey-building",
    description:
      "A detached two-storey house on a quiet close in Garki, a short drive from Area 1 Shopping Centre. Three bedrooms upstairs, a guest room downstairs, a large sitting room, and a kitchen with a pantry. The compound is paved, fenced and gated, with space for three cars.",
    price: 165_000_000,
    city: "Garki",
    state: "FCT",
    address: "9 Moshood Abiola Way, Garki",
    attributes: {
      transactionType: "sale",
      area: "Garki",
      landmark: "Area 1 Shopping Centre",
      bedrooms: 3,
      bathrooms: 4,
      toilets: 4,
      parking: 3,
      size: "456",
      sizeUnit: "sqm",
      yearBuilt: "2000",
      negotiable: true,
    },
  },
  {
    id: "cmulb1e8c0002curipyqp0ahv",
    title: "Half plot of land in Daki Biyu, Abuja",
    slug: "abuja-daki-biyu-half-plot-of-land",
    description:
      "A half plot (300 sqm) in a built-up part of Daki Biyu, with a registered survey and a Certificate of Occupancy. The access road is tarred, electricity poles run along the street, and the neighbourhood is mostly completed houses. Suits a small family build.",
    price: 32_000_000,
    city: "Daki Biyu",
    state: "FCT",
    address: "Off Daki Biyu Market Road",
    attributes: {
      transactionType: "sale",
      sizeInPlots: 0.5,
      size: "300",
      sizeUnit: "sqm",
      titleType: "Certificate of Occupancy",
      surveyPlanAvailable: true,
      landmark: "Daki Biyu Market",
      negotiable: true,
    },
  },
];

for (const fix of FIXES) {
  const before = await prisma.listing.findUnique({
    where: { id: fix.id },
    select: { title: true, price: true, city: true, state: true, slug: true },
  });

  if (!before) {
    console.log("skip (row gone):", fix.id);
    continue;
  }

  await prisma.listing.update({
    where: { id: fix.id },
    data: {
      title: fix.title,
      slug: fix.slug,
      description: fix.description,
      price: fix.price,
      city: fix.city,
      state: fix.state,
      address: fix.address,
      attributes: fix.attributes,
    },
  });

  console.log(
    `"${before.title}" ₦${Number(before.price)} ${before.city}/${before.state}` +
      `  ->  "${fix.title}" ₦${fix.price.toLocaleString("en-NG")} ${fix.city}/${fix.state}`,
  );
}

const total = await prisma.listing.count();
const published = await prisma.listing.count({ where: { status: "PUBLISHED" } });
console.log(`done — ${total} listings, ${published} published`);
await prisma.$disconnect();
