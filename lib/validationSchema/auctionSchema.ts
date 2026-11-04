import { z } from "zod";
import { toDatetimeLocal } from "@/lib/format";
import type { Auction } from "@/services/types/AuctionServicesTypes";

function getStartOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function isValidDate(value: string) {
  return !Number.isNaN(new Date(value).getTime());
}

export const auctionSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(120, "Title must be 120 characters or less"),
    description: z
      .string()
      .trim()
      .max(2000, "Description must be 2000 characters or less"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  })
  .refine((data) => isValidDate(data.startTime), {
    message: "Start time is invalid",
    path: ["startTime"],
  })
  .refine((data) => isValidDate(data.endTime), {
    message: "End time is invalid",
    path: ["endTime"],
  })
  .refine(
    (data) => {
      if (!isValidDate(data.startTime)) return true;
      return new Date(data.startTime) >= getStartOfToday();
    },
    {
      message: "Start time must be today or a future date",
      path: ["startTime"],
    },
  )
  .refine(
    (data) => {
      if (!isValidDate(data.endTime)) return true;
      return new Date(data.endTime) >= getStartOfToday();
    },
    {
      message: "End time must be today or a future date",
      path: ["endTime"],
    },
  )
  .refine(
    (data) => {
      if (!isValidDate(data.startTime) || !isValidDate(data.endTime)) return true;
      return new Date(data.endTime) > new Date(data.startTime);
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  );

export type AuctionFormValues = z.infer<typeof auctionSchema>;

export const auctionDefaultValues: AuctionFormValues = {
  title: "",
  description: "",
  startTime: "",
  endTime: "",
};

export function getAuctionFormValues(auction: Auction): AuctionFormValues {
  return {
    title: auction.title,
    description: auction.description,
    startTime: toDatetimeLocal(auction.startTime),
    endTime: toDatetimeLocal(auction.endTime),
  };
}
