export default function Location() {
  return (
    <section className="space-y-4">

      <div>
        <h2 className="text-lg font-semibold text-gray-950">
          Location
        </h2>

        <p className="text-sm text-gray-500">
          Where is the property located?
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">

        <input
          name="state"
          placeholder="State"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-950 outline-none placeholder:text-gray-400 focus:border-[#114b3d]"
        />

        <input
          name="city"
          placeholder="City"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-950 outline-none placeholder:text-gray-400 focus:border-[#114b3d]"
        />

        <input
          name="area"
          placeholder="Area"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-950 outline-none placeholder:text-gray-400 focus:border-[#114b3d]"
        />

        <input
          name="landmark"
          placeholder="Landmark"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-950 outline-none placeholder:text-gray-400 focus:border-[#114b3d]"
        />

      </div>

      <textarea
        name="address"
        rows={3}
        placeholder="Street Address"
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-950 outline-none placeholder:text-gray-400 focus:border-[#114b3d]"
      />
    </section>
  );
}
