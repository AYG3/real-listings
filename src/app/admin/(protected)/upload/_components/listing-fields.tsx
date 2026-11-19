"use client";

import type { ReactNode } from "react";
import BasicInformation from "./basic-information";
import ListingDetails from "./listing-details";
import Location from "./location";

type ListingFieldDefaults = {
  title?: string;
  price?: string;
  type?: "HOUSE" | "LAND";
  transactionType?: string;
  negotiable?: boolean;
  description?: string;
  state?: string;
  city?: string;
  area?: string;
  landmark?: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  toilets?: number;
  parking?: number;
  size?: string;
  sizeUnit?: string;
  yearBuilt?: string;
};

/**
 * The three listing form sections as one block, so the create and edit forms
 * render identical fields and share one source of validation feedback.
 */
export default function ListingFields({
  defaults,
  fieldErrors,
  media,
}: {
  defaults?: ListingFieldDefaults;
  fieldErrors?: Record<string, string>;
  media?: ReactNode;
}) {
  return (
    <>
      <BasicInformation
        showStatus={false}
        fieldErrors={fieldErrors}
        defaults={
          defaults
            ? {
                title: defaults.title,
                price: defaults.price,
                type: defaults.type,
                transactionType: defaults.transactionType,
                negotiable: defaults.negotiable,
                description: defaults.description,
              }
            : undefined
        }
      />
      <Location
        fieldErrors={fieldErrors}
        defaults={
          defaults
            ? {
                state: defaults.state,
                city: defaults.city,
                area: defaults.area,
                landmark: defaults.landmark,
                address: defaults.address,
              }
            : undefined
        }
      />
      <ListingDetails
        fieldErrors={fieldErrors}
        media={media}
        defaults={
          defaults
            ? {
                bedrooms: defaults.bedrooms,
                bathrooms: defaults.bathrooms,
                toilets: defaults.toilets,
                parking: defaults.parking,
                size: defaults.size,
                sizeUnit: defaults.sizeUnit,
                yearBuilt: defaults.yearBuilt,
              }
            : undefined
        }
      />
    </>
  );
}
