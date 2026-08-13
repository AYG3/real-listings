import PropertyForm from "./_components/listing-form"
export default function NewPropertyPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Create Property
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Add a new property listing to your portfolio.
        </p>
      </div>

      <PropertyForm />
    </main>
  );
}