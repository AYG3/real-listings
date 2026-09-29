import prisma from "@/lib/prisma";
import Image from "next/image";
import { Heart, MapPin, BedDouble, Bath, Square } from "lucide-react";

export default async function FeaturedPropertiesSection() {
  const properties = await prisma.listing.findMany({
    where: { status: "PUBLISHED" },
    include: {
      images: { orderBy: { order: "asc" } },
      agent: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="py-20 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Featured Properties
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {properties.map((prop) => {
            const attrs = (prop.attributes ?? {}) as Record<string, unknown>;
            const price = new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: prop.currency,
              maximumFractionDigits: 0,
            }).format(prop.price.toNumber());

            return (
              <div
                key={prop.id}
                className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col"
              >
                <div className="relative h-60">
                  {prop.images[0]?.url ? (
                    <Image
                      src={prop.images[0].url}
                      alt={prop.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                  <div className="absolute top-4 left-4 bg-[#114b3d] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                    {prop.type}
                  </div>
                  <button className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md rounded-full hover:bg-black/30 transition shadow-sm">
                    <Heart className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </button>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{price}</div>
                  <h3 className="text-[17px] font-bold text-gray-800 mb-2">{prop.title}</h3>

                  <div className="flex items-center text-gray-500 text-sm mb-6 font-medium">
                    <MapPin className="w-4 h-4 mr-1.5" />
                    {`${prop.city}, ${prop.state}`}
                  </div>

                  <div className="flex items-center justify-between text-gray-600 text-sm mb-6 font-medium">
                    <div className="flex items-center">
                      <BedDouble className="w-4 h-4 mr-2" />
                      {(attrs.bedrooms as number | string) ?? "—"} Beds
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-2" />
                      {(attrs.bathrooms as number | string) ?? "—"} Baths
                    </div>
                    <div className="flex items-center">
                      <Square className="w-4 h-4 mr-2" />
                      {attrs.size ? `${attrs.size} ${attrs.sizeUnit ?? ""}`.trim() : "—"}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <button className="w-full py-3 text-sm font-bold text-gray-800 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}