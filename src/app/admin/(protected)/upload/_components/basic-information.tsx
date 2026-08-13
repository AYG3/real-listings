export default function BasicInformation() {
  return (
    <section className="space-y-4">

      <div>
        <h2 className="text-lg font-semibold text-gray-950">
          Basic Information
        </h2>

        <p className="text-sm text-gray-500">
          General details about the listing.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Listing Title
          </label>

          <input
            name="title"
            type="text"
            placeholder="Modern 4 Bedroom Duplex"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-950 outline-none placeholder:text-gray-400 focus:border-[#114b3d]"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Price
          </label>

          <input
            name="price"
            type="number"
            placeholder="250000000"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-950 outline-none placeholder:text-gray-400 focus:border-[#114b3d]"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Listing Type
          </label>

          <select name="type" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-950 outline-none focus:border-[#114b3d]">
            <option value="HOUSE">House</option>
            <option value="LAND">Land</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Purpose
          </label>

          <select name="transactionType" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-950 outline-none focus:border-[#114b3d]">
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
            <option value="short-let">Short Let</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Status
          </label>

          <select name="status" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-950 outline-none focus:border-[#114b3d]">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="UNDER_OFFER">Under Offer</option>
            <option value="SOLD">Sold</option>
            <option value="RENTED">Rented</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2">
            <input name="negotiable" type="checkbox" />

            <span className="text-sm text-gray-700">
              Negotiable
            </span>
          </label>
        </div>

      </div>

      <textarea
        name="description"
        rows={4}
        placeholder="Describe the property"
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-950 outline-none placeholder:text-gray-400 focus:border-[#114b3d]"
      />
    </section>
  );
}
