import { z } from "zod";
import { ItemCondition } from "@/enums/itemCondition";
import { ShippingType } from "@/enums/shippingType";
import type { Item } from "@/services/types/ItemsServicesTypes";

export const MAX_ITEM_IMAGES = 5;

export const itemConditionSchema = z.enum(
  [
    ItemCondition.NEW,
    ItemCondition.LIKE_NEW,
    ItemCondition.GOOD,
    ItemCondition.FAIR,
    ItemCondition.POOR,
  ],
  { message: "Condition is required" },
);

export const shippingTypeSchema = z.enum(
  [ShippingType.FREE, ShippingType.FLAT_RATE],
  { message: "Shipping type is required" },
);

export const itemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Title must be 120 characters or less"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(2000, "Description must be 2000 characters or less"),
  categoryId: z.string().min(1, "Category is required"),
  itemCondition: itemConditionSchema,
  startingPrice: z
    .string()
    .trim()
    .min(1, "Starting price is required")
    .refine((value) => Number(value) > 0, "Starting price must be greater than 0"),
  reservePrice: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || Number(value) > 0,
      "Reserve price must be greater than 0",
    ),
  shippingType: shippingTypeSchema,
  shippingCost: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || Number(value) >= 0,
      "Shipping cost cannot be negative",
    ),
  imageCount: z
    .number()
    .min(1, "At least one image is required")
    .max(MAX_ITEM_IMAGES, `You can upload up to ${MAX_ITEM_IMAGES} images`),
});

export type ItemFormValues = z.infer<typeof itemSchema>;

export const itemDefaultValues: ItemFormValues = {
  title: "",
  description: "",
  categoryId: "",
  itemCondition: ItemCondition.GOOD,
  startingPrice: "",
  reservePrice: "",
  shippingType: ShippingType.FLAT_RATE,
  shippingCost: "",
  imageCount: 0,
};

export function getItemFormValues(item: Item): ItemFormValues {
  return {
    title: item.title,
    description: item.description,
    categoryId: item.categoryId,
    itemCondition: item.itemCondition,
    startingPrice: item.startingPrice ?? "",
    reservePrice: item.reservePrice ?? "",
    shippingType: item.shippingType,
    shippingCost: item.shippingCost ?? "",
    imageCount: item.images.length,
  };
}
