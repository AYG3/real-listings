import { Input, Textarea } from "@/components/ui/field";

type LocationDefaults = {
  state?: string;
  city?: string;
  area?: string;
  landmark?: string;
  address?: string;
};

export default function Location({
  defaults,
}: {
  defaults?: LocationDefaults;
} = {}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-ink-900">Location</h2>
        <p className="text-sm text-muted-500">Where is the property located?</p>
      </div>

      <div className="grid gap-x-4 md:grid-cols-2">
        <Input
          label="State"
          name="state"
          placeholder="Lagos"
          defaultValue={defaults?.state}
          required
        />
        <Input
          label="City"
          name="city"
          placeholder="Lekki"
          defaultValue={defaults?.city}
          required
        />
        <Input
          label="Area"
          name="area"
          placeholder="Phase 2"
          defaultValue={defaults?.area}
        />
        <Input
          label="Landmark"
          name="landmark"
          placeholder="Near Admiralty Way"
          defaultValue={defaults?.landmark}
        />
      </div>

      <Textarea
        label="Street address"
        name="address"
        rows={2}
        defaultValue={defaults?.address}
        placeholder="14 Admiralty Way, Lekki Phase 1"
      />
    </section>
  );
}
