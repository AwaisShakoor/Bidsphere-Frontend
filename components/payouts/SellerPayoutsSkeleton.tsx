export function SellerPayoutsSkeleton() {
  return (
    <div
      className="flex flex-col gap-3"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading payouts"
    >
      <section className="relative overflow-hidden rounded-2xl bg-primary/6 ring-1 ring-primary/10">
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-1 bg-primary"
        />
        <div className="relative grid gap-5 px-4 py-5 sm:px-6 sm:py-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="min-w-0 space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
              <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-64 max-w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-full max-w-xl animate-pulse rounded bg-muted" />
            </div>

            <div className="space-y-3">
              <div className="grid max-w-md grid-cols-2 gap-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-card/90 px-3.5 py-3 ring-1 ring-border"
                  >
                    <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                    <div className="mt-2 h-7 w-20 animate-pulse rounded bg-muted" />
                    <div className="mt-1.5 h-3 w-24 animate-pulse rounded bg-muted" />
                  </div>
                ))}
              </div>

              <div className="max-w-md space-y-2 rounded-xl bg-card/90 p-3.5 ring-1 ring-border">
                <div className="flex items-center justify-between gap-2">
                  <div className="h-3 w-28 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
                  <div className="h-10 w-full animate-pulse rounded-lg bg-muted sm:w-40" />
                </div>
                <div className="h-3 w-56 max-w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-card/90 p-3.5 ring-1 ring-border sm:p-4">
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            <div className="mt-2.5 space-y-2.5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex gap-2.5">
                  <div className="size-8 shrink-0 animate-pulse rounded-lg bg-muted" />
                  <div className="min-w-0 flex-1 space-y-1.5 pt-0.5">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-2 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl bg-card px-3.5 py-3 ring-1 ring-border"
          >
            <div className="size-7 animate-pulse rounded-md bg-muted" />
            <div className="mt-2 h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="mt-1.5 h-3 w-full animate-pulse rounded bg-muted" />
          </div>
        ))}
      </section>
    </div>
  );
}
