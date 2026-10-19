"use client";

import { useRouter } from "next/navigation";
import { CategoriesSkeleton } from "./CategoriesSkeleton";
import {
  ALL_CATEGORIES_ICON,
  getCategoryIcon,
} from "@/lib/constants/categories";
import { useCategories } from "@/services/hooks/CategoryServicesHook";

export function CategoryList() {
  const router = useRouter();
  const { data, isPending } = useCategories();
  const categories = data?.data ?? [];

  if (isPending) {
    return <CategoriesSkeleton />;
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="cursor-pointer rounded-2xl bg-card p-4 text-left shadow-md shadow-primary/5 ring-1 ring-primary/40 transition"
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <ALL_CATEGORIES_ICON className="size-5" aria-hidden />
        </span>
        <span className="mt-3 block text-sm font-medium text-foreground">
          All categories
        </span>
      </button>

      {categories.map((category) => {
        const Icon = getCategoryIcon(category.slug);

        return (
          <button
            key={category.id}
            type="button"
            onClick={() =>
              router.push(`/dashboard?category=${category.slug}`)
            }
            className="cursor-pointer rounded-2xl bg-card p-4 text-left shadow-md shadow-primary/5 ring-1 ring-border transition hover:ring-primary/30"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="mt-3 block text-sm font-medium text-foreground">
              {category.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
