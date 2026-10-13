import { z } from "zod";

import { ItemCondition } from "@/enums/itemCondition";
import { ShippingType } from "@/enums/shippingType";

export const itemConditionSchema = z.enum([
  ItemCondition.NEW,
  ItemCondition.LIKE_NEW,
  ItemCondition.GOOD,
  ItemCondition.FAIR,
  ItemCondition.POOR,
]);

export const shippingTypeSchema = z.enum([
  ShippingType.FREE,
  ShippingType.FLAT_RATE,
]);

const optionalPrice = z.union([
  z.literal(""),
  z.coerce.number().positive("Must be greater than 0"),
]);

export const createAuctionSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title must be 100 characters or less"),
    description: z.string().min(1, "Description is required"),
    categoryId: z.string().min(1, "Category is required"),
    condition: itemConditionSchema,
    startingPrice: z.coerce
      .number({ message: "Starting price is required" })
      .positive("Starting price must be greater than 0"),
    reservePrice: optionalPrice,
    shippingType: shippingTypeSchema,
    shippingCost: z.union([
      z.literal(""),
      z.coerce.number().min(0, "Shipping cost cannot be negative"),
    ]),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  })
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: "End time must be after start time",
    path: ["endTime"],
  })
  .refine(
    (data) =>
      data.shippingType === ShippingType.FREE ||
      (data.shippingCost !== "" && Number(data.shippingCost) >= 0),
    {
      message: "Shipping cost is required for flat rate",
      path: ["shippingCost"],
    },
  );

export type CreateAuctionFormValues = z.output<typeof createAuctionSchema>;
export type CreateAuctionFormInput = z.input<typeof createAuctionSchema>;

export const createAuctionDefaultValues: CreateAuctionFormInput = {
  title: "",
  description: "",
  categoryId: "",
  condition: ItemCondition.GOOD,
  startingPrice: 1,
  reservePrice: "",
  shippingType: ShippingType.FREE,
  shippingCost: "",
  startTime: "",
  endTime: "",
};

export function toDatetimeLocalValue(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Prefill the create form when editing an existing auction */
export function getEditAuctionFormDefaultValues(auction: {
  startingPrice: string;
  reservePrice: string | null;
  shippingType: ShippingType;
  shippingCost: string;
  startTime: string;
  endTime: string;
  item: {
    title: string;
    description: string;
    itemCondition: ItemCondition;
    categoryId: string;
  };
}): CreateAuctionFormInput {
  return {
    title: auction.item.title,
    description: auction.item.description,
    categoryId: auction.item.categoryId,
    condition: auction.item.itemCondition,
    startingPrice: Number(auction.startingPrice) || 1,
    reservePrice: auction.reservePrice ? Number(auction.reservePrice) : "",
    shippingType: auction.shippingType,
    shippingCost:
      auction.shippingType === ShippingType.FLAT_RATE
        ? Number(auction.shippingCost) || ""
        : "",
    startTime: toDatetimeLocalValue(auction.startTime),
    endTime: toDatetimeLocalValue(auction.endTime),
  };
}
