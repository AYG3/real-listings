export default function AdminLoading() {
  return (
    <div className="bg-surface px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="h-4 w-16 animate-pulse rounded bg-gray-200 motion-reduce:animate-none" />
        <div className="mt-3 h-9 w-56 animate-pulse rounded-md bg-gray-200 motion-reduce:animate-none" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-lg border border-gray-200 bg-white motion-reduce:animate-none"
            />
          ))}
        </div>
        <div className="mt-8 h-96 animate-pulse rounded-lg border border-gray-200 bg-white motion-reduce:animate-none" />
      </div>
    </div>
  );
}
