import { z } from "zod";
import type { Auction } from "@/services/types/AuctionServicesTypes";

function toDatetimeLocal(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
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
  .refine(
    (data) => new Date(data.endTime) > new Date(data.startTime),
    { message: "End time must be after start time", path: ["endTime"] },
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
