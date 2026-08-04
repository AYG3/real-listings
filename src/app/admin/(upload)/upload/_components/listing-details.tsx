'use client'

import CloudinaryUploadWidget from "@/components/upload/CldUploadWidget";

export default function ListingDetails() {
  return (
    <section className="space-y-4">

      <div>
        <h2 className="text-lg font-semibold text-gray-950">
          Listing Details
        </h2>

        <p className="text-sm text-gray-500">
          Technical specifications of the property.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <CloudinaryUploadWidget/>
        
        <input
          name="bedrooms"
          type="number"
          placeholder="Bedrooms"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-950 outline-none placeholder:text-gray-400 focus:border-[#114b3d]"
        />

        <input
          name="bathrooms"
          type="number"
          placeholder="Bathrooms"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-950 outline-none placeholder:text-gray-400 focus:border-[#114b3d]"
        />

        <input
          name="toilets"
          type="number"
          placeholder="Toilets"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-950 outline-none placeholder:text-gray-400 focus:border-[#114b3d]"
        />

        <input
          name="parking"
          type="number"
          placeholder="Parking"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-950 outline-none placeholder:text-gray-400 focus:border-[#114b3d]"
        />

        <input
          name="size"
          placeholder="Listing Size"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-950 outline-none placeholder:text-gray-400 focus:border-[#114b3d]"
        />

        <select name="sizeUnit" className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-950 outline-none focus:border-[#114b3d]">
          <option value="sqm">sqm</option>
          <option value="sqft">sqft</option>
          <option value="acres">Acres</option>
        </select>

        <input
          name="yearBuilt"
          placeholder="Year Built"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-950 outline-none placeholder:text-gray-400 focus:border-[#114b3d]"
        />

      </div>
    </section>
  );
}
