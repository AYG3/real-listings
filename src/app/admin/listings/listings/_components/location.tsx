export default function Location() {
  return (
    <section className="space-y-4">

      <div>
        <h2 className="text-lg font-semibold">
          Location
        </h2>

        <p className="text-sm text-gray-500">
          Where is the property located?
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">

        <input
          placeholder="State"
          className="rounded-lg border px-3 py-2"
        />

        <input
          placeholder="City"
          className="rounded-lg border px-3 py-2"
        />

        <input
          placeholder="Area"
          className="rounded-lg border px-3 py-2"
        />

        <input
          placeholder="Landmark"
          className="rounded-lg border px-3 py-2"
        />

      </div>

      <textarea
        rows={3}
        placeholder="Street Address"
        className="w-full rounded-lg border px-3 py-2"
      />
    </section>
  );
}