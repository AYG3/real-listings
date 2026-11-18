import { Input, Textarea } from "@/components/ui/field";

export default function Location() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-ink-900">Location</h2>
        <p className="text-sm text-muted-500">Where is the property located?</p>
      </div>

      <div className="grid gap-x-4 md:grid-cols-2">
        <Input label="State" name="state" placeholder="Lagos" required />
        <Input label="City" name="city" placeholder="Lekki" required />
        <Input label="Area" name="area" placeholder="Phase 2" />
        <Input label="Landmark" name="landmark" placeholder="Near Admiralty Way" />
      </div>

      <Textarea
        label="Street address"
        name="address"
        rows={2}
        placeholder="14 Admiralty Way, Lekki Phase 1"
      />
    </section>
  );
}
