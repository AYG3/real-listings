export default function BasicInformation() {
  return (
    <section className="space-y-4">

      <div>
        <h2 className="text-lg font-semibold">
          Basic Information
        </h2>

        <p className="text-sm text-gray-500">
          General details about the listing.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">

        <div>
          <label className="mb-1 block text-sm font-medium">
            Listing Title
          </label>

          <input
            type="text"
            placeholder="Modern 4 Bedroom Duplex"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-[#114b3d]"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Price
          </label>

          <input
            type="number"
            placeholder="250000000"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-[#114b3d]"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Listing Type
          </label>

          <select className="w-full rounded-lg border px-3 py-2">
            <option>House</option>
            <option>Apartment</option>
            <option>Land</option>
            <option>Commercial</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Listing Type
          </label>

          <select className="w-full rounded-lg border px-3 py-2">
            <option>Sale</option>
            <option>Rent</option>
            <option>Short Let</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Status
          </label>

          <select className="w-full rounded-lg border px-3 py-2">
            <option>Available</option>
            <option>Pending</option>
            <option>Sold</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2">
            <input type="checkbox" />

            <span className="text-sm">
              Negotiable
            </span>
          </label>
        </div>

      </div>
    </section>
  );
}