import { Input, Select, Textarea } from "@/components/ui/field";

type BasicDefaults = {
  title?: string;
  price?: string;
  type?: "HOUSE" | "LAND";
  transactionType?: string;
  negotiable?: boolean;
  description?: string;
};

/**
 * `showStatus` is false for agent submissions: agents cannot choose a status,
 * they always enter moderation as drafts. `defaults` is what makes the same
 * fields reusable on the edit screen.
 */
export default function BasicInformation({
  showStatus = true,
  defaults,
}: {
  showStatus?: boolean;
  defaults?: BasicDefaults;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-ink-900">Basic Information</h2>
        <p className="text-sm text-muted-500">General details about the listing.</p>
      </div>

      <div className="grid gap-x-4 md:grid-cols-2">
        <Input
          label="Listing title"
          name="title"
          type="text"
          placeholder="Modern 4 bedroom duplex"
          defaultValue={defaults?.title}
          required
        />

        <Input
          label="Price (NGN)"
          name="price"
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="250000000"
          defaultValue={defaults?.price}
          required
        />

        <Select label="Listing type" name="type" defaultValue={defaults?.type ?? "HOUSE"}>
          <option value="HOUSE">House</option>
          <option value="LAND">Land</option>
        </Select>

        <Select
          label="Purpose"
          name="transactionType"
          defaultValue={defaults?.transactionType ?? "sale"}
        >
          <option value="sale">Sale</option>
          <option value="rent">Rent</option>
          <option value="short-let">Short let</option>
        </Select>

        {showStatus ? (
          <Select label="Status" name="status" defaultValue="DRAFT">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="UNDER_OFFER">Under offer</option>
            <option value="SOLD">Sold</option>
            <option value="RENTED">Rented</option>
            <option value="ARCHIVED">Archived</option>
          </Select>
        ) : null}

        <div className="mb-5 flex items-center pt-7">
          <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
            <input
              name="negotiable"
              type="checkbox"
              defaultChecked={defaults?.negotiable}
              className="h-4 w-4 rounded border-ink-900/20 text-forest-700"
            />
            Price is negotiable
          </label>
        </div>
      </div>

      <Textarea
        label="Description"
        name="description"
        rows={4}
        defaultValue={defaults?.description}
        placeholder="Describe the property, the neighbourhood, and what makes it worth a viewing."
        hint="Aim for 60–120 words. Buyers read this before they enquire."
      />
    </section>
  );
}
