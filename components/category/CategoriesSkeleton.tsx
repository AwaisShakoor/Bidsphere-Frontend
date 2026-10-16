export function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl bg-card p-4 shadow-md shadow-primary/5 ring-1 ring-border"
        >
          <div className="size-10 animate-pulse rounded-xl bg-muted" />
          <div className="mt-3 h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
