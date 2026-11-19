"use client";

import type { ReactNode } from "react";
import CloudinaryUploadWidget from "@/components/upload/CldUploadWidget";
import { Input, Select } from "@/components/ui/field";

type DetailsDefaults = {
  bedrooms?: number;
  bathrooms?: number;
  toilets?: number;
  parking?: number;
  size?: string;
  sizeUnit?: string;
  yearBuilt?: string;
};

export default function ListingDetails({
  defaults,
  media,
}: {
  defaults?: DetailsDefaults;
  /** Replaces the upload widget on the edit screen, where photos already exist. */
  media?: ReactNode;
} = {}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-ink-900">Listing details</h2>
        <p className="text-sm text-muted-500">
          Technical specifications and photos of the property.
        </p>
      </div>

      {media ?? (
        <div className="rounded-card border border-ink-900/10 bg-surface p-4">
          <p className="mb-3 text-sm font-semibold text-ink-900">
            Photos{" "}
            <span className="font-normal text-muted-500">
              (first image is the cover)
            </span>
          </p>
          <CloudinaryUploadWidget />
        </div>
      )}

      <div className="grid gap-x-4 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          label="Bedrooms"
          name="bedrooms"
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="4"
          defaultValue={defaults?.bedrooms}
        />
        <Input
          label="Bathrooms"
          name="bathrooms"
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="3"
          defaultValue={defaults?.bathrooms}
        />
        <Input
          label="Toilets"
          name="toilets"
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="4"
          defaultValue={defaults?.toilets}
        />
        <Input
          label="Parking spaces"
          name="parking"
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="2"
          defaultValue={defaults?.parking}
        />
        <Input
          label="Size"
          name="size"
          placeholder="420"
          defaultValue={defaults?.size}
        />
        <Select
          label="Size unit"
          name="sizeUnit"
          defaultValue={defaults?.sizeUnit ?? "sqm"}
        >
          <option value="sqm">sqm</option>
          <option value="sqft">sqft</option>
          <option value="acres">acres</option>
        </Select>
        <Input
          label="Year built"
          name="yearBuilt"
          inputMode="numeric"
          placeholder="2021"
          defaultValue={defaults?.yearBuilt}
        />
      </div>
    </section>
  );
}
