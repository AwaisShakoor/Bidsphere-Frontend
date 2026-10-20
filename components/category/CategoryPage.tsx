"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { CategoryItems } from "@/components/category/CategoryItems";
import { Button } from "@/components/ui/button";
import { getCategoryIcon } from "@/lib/constants/categories";
import { useCategories } from "@/services/hooks/CategoryServicesHook";

export function CategoryPage({ slug }: { slug: string }) {
  const router = useRouter();
  const { data: categoriesData, isPending } = useCategories();
  const category = categoriesData?.data?.find((item) => item.slug === slug);
  const Icon = getCategoryIcon(slug);

  return (
    <main className="relative flex-1 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-primary/8 blur-3xl"
      />

      <div className="app-container relative flex flex-col gap-8 py-8 sm:py-10">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="w-fit text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft data-icon="inline-start" />
          Back to dashboard
        </Button>

        <section className="rounded-2xl bg-card p-5 shadow-md shadow-primary/5 ring-1 ring-border sm:p-6">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-6" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-medium tracking-wide text-primary uppercase">
                Category
              </p>
              {isPending ? (
                <div className="space-y-2">
                  <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-64 animate-pulse rounded bg-muted" />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {category?.name ?? slug.replaceAll("-", " ")}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Browse items listed in this category.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Items
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Available listings for this category.
            </p>
          </div>
          <CategoryItems slug={slug} />
        </section>
      </div>
    </main>
  );
}
