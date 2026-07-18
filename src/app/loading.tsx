export default function Loading() {
  return (
    <div className="container-site py-12" aria-busy="true" aria-label="Loading page">
      <div className="skeleton h-8 w-44 rounded-full" />
      <div className="skeleton mt-4 h-12 w-2/3 max-w-xl rounded-2xl" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-line bg-raised"
          >
            <div className="skeleton aspect-[4/3]" />
            <div className="space-y-3 p-5">
              <div className="skeleton h-5 w-28 rounded-full" />
              <div className="skeleton h-4 w-3/4 rounded-full" />
              <div className="skeleton h-4 w-1/2 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
