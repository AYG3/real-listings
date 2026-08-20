import ListingForm from "./_components/listing-form";

export default function CreateListingPage() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#114b3d]">
            Agent
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
            Create Listing
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-500">
            Add a new property listing to your portfolio.
          </p>
        </div>

        <ListingForm />
      </div>
    </div>
  );
}