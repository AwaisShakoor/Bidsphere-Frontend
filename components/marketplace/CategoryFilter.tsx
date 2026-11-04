"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Category } from "@/services/types/CategoryServicesTypes";

type CategoryFilterProps = {
  categories: Category[];
  categoryId: string;
  onCategoryChange: (id: string) => void;
  trailing?: ReactNode;
};

function chipClass(selected: boolean) {
  return cn(
    "inline-flex w-fit cursor-pointer items-center rounded-lg border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-all",
    selected
      ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
      : "border-border/80 bg-background text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
  );
}

export function CategoryFilter({
  categories,
  categoryId,
  onCategoryChange,
  trailing,
}: CategoryFilterProps) {
  return (
    <div
      role="listbox"
      aria-label="Categories"
      className="flex flex-wrap gap-2.5"
    >
      <button
        type="button"
        role="option"
        aria-selected={!categoryId}
        onClick={() => onCategoryChange("")}
        className={chipClass(!categoryId)}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          role="option"
          aria-selected={categoryId === category.id}
          onClick={() =>
            onCategoryChange(categoryId === category.id ? "" : category.id)
          }
          className={chipClass(categoryId === category.id)}
        >
          {category.name}
        </button>
      ))}
      {trailing ? <div className="ml-auto">{trailing}</div> : null}
    </div>
  );
}
