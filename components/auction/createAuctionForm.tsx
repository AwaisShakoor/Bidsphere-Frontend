"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ImagePlus, X } from "lucide-react";
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
import {
  useDeleteItemImage,
  useItemImages,
} from "@/services/hooks/ItemImagesServicesHook";
import type { Auction } from "@/services/types/AuctionServicesTypes";

const MAX_IMAGES = 5;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

type CreateAuctionFormProps = {
  onBack: () => void;
  auction?: Auction;
};

export function CreateAuctionForm({ onBack, auction }: CreateAuctionFormProps) {
  const isEditMode = Boolean(auction);
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const {mutate: createAuctionListing, isPending: isCreatingAuctionListing} = useCreateAuctionListing();
  const {mutate: updateAuctionListing, isPending: isUpdatingAuctionListing} = useUpdateAuctionListing();
  const { data: existingImages = [] } = useItemImages(auction?.itemId, {
    enabled: isEditMode,
  });
  const {mutate: deleteItemImage, isPending: isDeletingImage} = useDeleteItemImage();
  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

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
    isCreatingAuctionListing ||
    isUpdatingAuctionListing ||
    isDeletingImage;

  const remainingImageSlots = Math.max(
    0,
    MAX_IMAGES - existingImages.length - images.length,
  );

  const previews = useMemo(
    () => images.map((file) => URL.createObjectURL(file)),
    [images],
  );

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  function onSubmit(values: CreateAuctionFormValues) {
    if (!isEditMode && images.length === 0) {
      setImageError("At least one image is required");
      return;
    }
    if (images.some((file) => file.size > MAX_IMAGE_BYTES)) {
      setImageError("Each image must be under 2MB");
      return;
    }

    setImageError(null);

    if (isEditMode && auction) {
      updateAuctionListing({
        itemId: auction.itemId,
        auctionId: auction.id,
        values,
        images,
      }, { onSuccess: onBack });
      return;
    }

    createAuctionListing(
      { ...values, images },
      { onSuccess: onBack },
    );
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
              <Label htmlFor="images">
                Images{isEditMode ? " (optional)" : ""}
              </Label>
              {remainingImageSlots > 0 ? (
                <label
                  htmlFor="images"
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-8 text-center transition hover:bg-muted/60",
                    imageError && "border-destructive",
                  )}
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ImagePlus className="size-5" aria-hidden />
                  </span>
                  <p className="text-sm font-medium text-foreground">
                    {images.length > 0
                      ? `${images.length} new image${images.length === 1 ? "" : "s"} selected`
                      : "Click to upload images"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    jpeg, png, webp · up to {remainingImageSlots} more · 2MB each
                  </p>
                  <input
                    id="images"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="sr-only"
                    disabled={isPending}
                    onChange={(event) => {
                      const next = Array.from(event.target.files ?? []).slice(
                        0,
                        remainingImageSlots,
                      );
                      setImages((current) =>
                        [...current, ...next].slice(
                          0,
                          MAX_IMAGES - existingImages.length,
                        ),
                      );
                      setImageError(null);
                      event.target.value = "";
                    }}
                  />
                </label>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Maximum of {MAX_IMAGES} images reached. Remove one to add another.
                </p>
              )}

              {existingImages.length > 0 ? (
                <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {existingImages.map((image) => (
                    <li key={image.id} className="relative aspect-square">
                      <img
                        src={image.url}
                        alt=""
                        className="size-full rounded-lg object-cover ring-1 ring-border"
                      />
                      <button
                        type="button"
                        aria-label="Delete image"
                        className="absolute top-1 right-1 cursor-pointer flex size-6 items-center justify-center rounded-full bg-foreground/80 text-background transition hover:bg-foreground"
                        disabled={isPending || !auction?.itemId}
                        onClick={() => {
                          if (!auction?.itemId) return;
                          deleteItemImage({
                            itemId: auction.itemId,
                            imageId: image.id,
                          });
                        }}
                      >
                        <X className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}

              {previews.length > 0 ? (
                <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {previews.map((src, index) => (
                    <li key={src} className="relative aspect-square">
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className="size-full rounded-lg object-cover ring-1 ring-border"
                      />
                      <button
                        type="button"
                        aria-label={`Remove image ${index + 1}`}
                        className="absolute top-1 right-1 cursor-pointer flex size-6 items-center justify-center rounded-full bg-foreground/80 text-background transition hover:bg-foreground"
                        disabled={isPending}
                        onClick={() =>
                          setImages((current) =>
                            current.filter((_, i) => i !== index),
                          )
                        }
                      >
                        <X className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}

              {imageError ? (
                <p className="text-sm text-destructive">{imageError}</p>
              ) : null}
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
