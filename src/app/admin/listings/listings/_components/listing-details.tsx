export default function ListingDetails() {
  return (
    <section className="space-y-4">

      <div>
        <h2 className="text-lg font-semibold">
          Listing Details
        </h2>

        <p className="text-sm text-gray-500">
          Technical specifications of the property.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">

        <input
          type="number"
          placeholder="Bedrooms"
          className="rounded-lg border px-3 py-2"
        />

        <input
          type="number"
          placeholder="Bathrooms"
          className="rounded-lg border px-3 py-2"
        />

        <input
          type="number"
          placeholder="Toilets"
          className="rounded-lg border px-3 py-2"
        />

        <input
          type="number"
          placeholder="Parking"
          className="rounded-lg border px-3 py-2"
        />

        <input
          placeholder="Listing Size"
          className="rounded-lg border px-3 py-2"
        />

        <select className="rounded-lg border px-3 py-2">
          <option>sqm</option>
          <option>sqft</option>
          <option>Acres</option>
        </select>

        <input
          placeholder="Year Built"
          className="rounded-lg border px-3 py-2"
        />

      </div>
    </section>
  );
}