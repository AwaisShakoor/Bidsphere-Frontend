"use client";

import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ItemImageField } from "@/components/item/ItemImageField";
import type { ItemImageFieldValue } from "@/components/item/ItemImageField";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/FormField";
import { Label } from "@/components/ui/label";
import { ItemCondition } from "@/enums/itemCondition";
import { ShippingType } from "@/enums/shippingType";
import {
  getItemFormValues,
  itemDefaultValues,
  itemSchema,
  type ItemFormValues,
} from "@/lib/validationSchema/itemSchema";
import { cn } from "@/lib/utils";
import { useCategories } from "@/services/hooks/CategoryServicesHook";
import {
  useCreateItem,
  useUpdateItem,
} from "@/services/hooks/ItemServicesHook";
import type { Item } from "@/services/types/ItemsServicesTypes";

const selectClassName =
  "h-11 w-full min-w-0 cursor-pointer rounded-lg border border-input bg-transparent px-3.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30";

export function ItemForm({
  auctionId,
  item,
  onClose,
}: {
  auctionId: string;
  item?: Item;
  onClose: () => void;
}) {
  const isEdit = Boolean(item);
  const { data: categoriesData, isPending: isCategoriesPending } =
    useCategories();
  const categories = categoriesData?.data ?? [];
  const { mutate: createItem, isPending: isCreating } = useCreateItem();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateItem();
  const isPending = isCreating || isUpdating;
  const isFormLocked = isPending || isCategoriesPending;

  const [imageField, setImageField] = useState<ItemImageFieldValue>({
    images: [],
    removeImageIds: [],
    count: item?.images.length ?? 0,
  });

  const handleImagesChange = useCallback((value: ItemImageFieldValue) => {
    setImageField(value);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isSubmitted },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: item ? getItemFormValues(item) : itemDefaultValues,
  });

  useEffect(() => {
    setValue("imageCount", imageField.count);
    if (imageField.count >= 1) clearErrors("imageCount");
  }, [imageField.count, setValue, clearErrors]);

  useEffect(() => {
    if (!item?.categoryId || categories.length === 0) return;
    setValue("categoryId", item.categoryId);
  }, [categories, item?.categoryId, setValue]);

  function handleSaveItem(values: ItemFormValues) {
    const payload = {
      title: values.title,
      description: values.description,
      categoryId: values.categoryId,
      itemCondition: values.itemCondition,
      startingPrice: Number(values.startingPrice),
      shippingType: values.shippingType,
      ...(values.reservePrice
        ? { reservePrice: Number(values.reservePrice) }
        : {}),
      ...(values.shippingCost
        ? { shippingCost: Number(values.shippingCost) }
        : {}),
    };

    if (isEdit && item) {
      updateItem(
        {
          auctionId,
          itemId: item.id,
          ...payload,
          images: imageField.images,
          removeImageIds: imageField.removeImageIds,
        },
        { onSuccess: onClose },
      );
      return;
    }

    createItem(
      { auctionId, ...payload, images: imageField.images },
      { onSuccess: onClose },
    );
  }

  return (
    <form
      onSubmit={handleSubmit(handleSaveItem)}
      className="space-y-6"
      noValidate
    >
      <div className="space-y-5">
        <Field
          label="Title"
          placeholder="e.g. Vintage camera"
          autoComplete="off"
          disabled={isFormLocked}
          error={errors.title}
          {...register("title")}
        />

        <div className="space-y-1.5 text-left">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={4}
            placeholder="Describe the item"
            disabled={isFormLocked}
            aria-invalid={!!errors.description}
            className={cn(
              "w-full min-w-0 rounded-lg border border-input bg-transparent px-3.5 py-2.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30",
            )}
            {...register("description")}
          />
          {errors.description?.message ? (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5 text-left">
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              aria-invalid={!!errors.categoryId}
              disabled={isFormLocked}
              className={selectClassName}
              {...register("categoryId")}
            >
              <option value="">
                {isCategoriesPending ? "Loading..." : "Select category"}
              </option>
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
            <Label htmlFor="itemCondition">Condition</Label>
            <select
              id="itemCondition"
              aria-invalid={!!errors.itemCondition}
              disabled={isFormLocked}
              className={selectClassName}
              {...register("itemCondition")}
            >
              {Object.values(ItemCondition).map((condition) => (
                <option key={condition} value={condition}>
                  {condition.replaceAll("_", " ")}
                </option>
              ))}
            </select>
            {errors.itemCondition?.message ? (
              <p className="text-sm text-destructive">
                {errors.itemCondition.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Starting price"
            type="number"
            step="0.01"
            min="0"
            disabled={isFormLocked}
            error={errors.startingPrice}
            {...register("startingPrice")}
          />
          <Field
            label="Reserve price (optional)"
            type="number"
            step="0.01"
            min="0"
            disabled={isFormLocked}
            error={errors.reservePrice}
            {...register("reservePrice")}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5 text-left">
            <Label htmlFor="shippingType">Shipping type</Label>
            <select
              id="shippingType"
              aria-invalid={!!errors.shippingType}
              disabled={isFormLocked}
              className={selectClassName}
              {...register("shippingType")}
            >
              {Object.values(ShippingType).map((type) => (
                <option key={type} value={type}>
                  {type.replaceAll("_", " ")}
                </option>
              ))}
            </select>
            {errors.shippingType?.message ? (
              <p className="text-sm text-destructive">
                {errors.shippingType.message}
              </p>
            ) : null}
          </div>

          <Field
            label="Shipping cost (optional)"
            type="number"
            step="0.01"
            min="0"
            disabled={isFormLocked}
            error={errors.shippingCost}
            {...register("shippingCost")}
          />
        </div>

        <ItemImageField
          existingImages={item?.images}
          itemTitle={item?.title}
          disabled={isFormLocked}
          error={isSubmitted ? errors.imageCount?.message : undefined}
          onChange={handleImagesChange}
        />
        <input
          type="hidden"
          {...register("imageCount", { valueAsNumber: true })}
        />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isFormLocked}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isFormLocked}>
          {isPending
            ? isEdit
              ? "Saving..."
              : "Creating..."
            : isEdit
              ? "Save changes"
              : "Create item"}
        </Button>
      </div>
    </form>
  );
}
