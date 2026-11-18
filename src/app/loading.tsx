export default function Loading() {
  return (
    <div className="min-h-screen bg-ivory-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="h-56 animate-pulse rounded-2xl bg-gray-200 motion-reduce:animate-none" />
        <div className="mt-10 h-8 w-56 animate-pulse rounded-md bg-gray-200 motion-reduce:animate-none" />
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <div className="h-48 animate-pulse bg-gray-200 motion-reduce:animate-none" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200 motion-reduce:animate-none" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 motion-reduce:animate-none" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 motion-reduce:animate-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
