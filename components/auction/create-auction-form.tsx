"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { ITEM_CONDITION_OPTIONS } from "@/enums/itemCondition";
import { ShippingType, SHIPPING_TYPE_OPTIONS } from "@/enums/shippingType";
import {
  createAuctionDefaultValues,
  createAuctionSchema,
  getEditAuctionFormDefaultValues,
  type CreateAuctionFormInput,
  type CreateAuctionFormValues,
} from "@/lib/validations/auction";
import { cn } from "@/lib/utils";
import {
  useCreateAuctionListing,
  useUpdateAuctionListing,
} from "@/services/hooks/AuctionServicesHook";
import { useCategories } from "@/services/hooks/CategoryServicesHook";
import type { Auction } from "@/services/types/AuctionServicesTypes";

type CreateAuctionFormProps = {
  onBack: () => void;
  auction?: Auction;
};

export function CreateAuctionForm({ onBack, auction }: CreateAuctionFormProps) {
  const isEditMode = Boolean(auction);
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const createAuctionListing = useCreateAuctionListing();
  const updateAuctionListing = useUpdateAuctionListing();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateAuctionFormInput, unknown, CreateAuctionFormValues>({
    resolver: zodResolver(createAuctionSchema),
    defaultValues: auction
      ? getEditAuctionFormDefaultValues(auction)
      : createAuctionDefaultValues,
  });

  const shippingType = watch("shippingType");
  const isPending =
    createAuctionListing.isPending || updateAuctionListing.isPending;

  function onSubmit(values: CreateAuctionFormValues) {
    if (isEditMode && auction) {
      updateAuctionListing.mutate(
        {
          itemId: auction.itemId,
          auctionId: auction.id,
          values,
        },
        { onSuccess: onBack },
      );
      return;
    }

    createAuctionListing.mutate(values, {
      onSuccess: onBack,
    });
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to my auctions
      </button>

      <div className="rounded-2xl bg-card p-6 shadow-xl shadow-primary/10 ring-1 ring-border sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            Seller
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {isEditMode ? "Edit auction" : "Create auction"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isEditMode
              ? "Update item details and auction settings."
              : "Add your item details and auction settings."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
          <section className="space-y-4">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Item details
            </h2>

            <Field
              label="Title"
              placeholder="e.g. Vintage camera lens"
              error={errors.title}
              {...register("title")}
            />

            <div className="space-y-1.5 text-left">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={4}
                placeholder="Describe condition, history, and what’s included..."
                className={cn(
                  "w-full rounded-lg border border-input bg-transparent px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                  errors.description &&
                    "border-destructive focus-visible:ring-destructive/20",
                )}
                {...register("description")}
              />
              {errors.description?.message ? (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 text-left">
                <Label htmlFor="categoryId">Category</Label>
                <select
                  id="categoryId"
                  disabled={categoriesLoading}
                  className="h-11 w-full rounded-lg border border-input bg-transparent px-3.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  {...register("categoryId")}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId?.message ? (
                  <p className="text-sm text-destructive">
                    {errors.categoryId.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5 text-left">
                <Label htmlFor="condition">Condition</Label>
                <select
                  id="condition"
                  className="h-11 w-full rounded-lg border border-input bg-transparent px-3.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  {...register("condition")}
                >
                  {ITEM_CONDITION_OPTIONS.map((condition) => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
                {errors.condition?.message ? (
                  <p className="text-sm text-destructive">
                    {errors.condition.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <Label>Images</Label>
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-8 text-center">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ImagePlus className="size-5" aria-hidden />
                </span>
                <p className="text-sm font-medium text-foreground">
                  Image upload coming soon
                </p>
                <p className="text-xs text-muted-foreground">
                  You’ll add photos when the upload API is ready.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Auction settings
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Starting price ($)"
                type="number"
                step="0.01"
                min="0"
                error={errors.startingPrice}
                {...register("startingPrice")}
              />
              <Field
                label="Reserve price ($ optional)"
                type="number"
                step="0.01"
                min="0"
                error={
                  errors.reservePrice
                    ? { message: String(errors.reservePrice.message ?? "") }
                    : undefined
                }
                {...register("reservePrice")}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 text-left">
                <Label htmlFor="shippingType">Shipping</Label>
                <select
                  id="shippingType"
                  className="h-11 w-full rounded-lg border border-input bg-transparent px-3.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  {...register("shippingType")}
                >
                  {SHIPPING_TYPE_OPTIONS.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {shippingType === ShippingType.FLAT_RATE ? (
                <Field
                  label="Shipping cost ($)"
                  type="number"
                  step="0.01"
                  min="0"
                  error={
                    errors.shippingCost
                      ? { message: String(errors.shippingCost.message ?? "") }
                      : undefined
                  }
                  {...register("shippingCost")}
                />
              ) : (
                <div className="hidden sm:block" />
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Start time"
                type="datetime-local"
                error={errors.startTime}
                {...register("startTime")}
              />
              <Field
                label="End time"
                type="datetime-local"
                error={errors.endTime}
                {...register("endTime")}
              />
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="sm:min-w-40"
              disabled={isPending}
            >
              {isPending
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : isEditMode
                  ? "Save changes"
                  : "Create auction"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
