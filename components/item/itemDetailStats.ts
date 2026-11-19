import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  CircleDollarSign,
  Gavel,
  Timer,
  Trophy,
  Truck,
} from "lucide-react";
import { formatMoney, formatSnakeCase } from "@/lib/format";
import type { Item } from "@/services/types/ItemsServicesTypes";

export type ItemDetailStat = {
  icon: LucideIcon;
  label: string;
  value: string;
  accent?: boolean;
};

export function getItemDetailStats(item: Item): ItemDetailStat[] {
  return [
    {
      icon: CircleDollarSign,
      label: "Starting price",
      value: formatMoney(item.startingPrice),
      accent: true,
    },
    {
      icon: Banknote,
      label: "Reserve price",
      value: formatMoney(item.reservePrice),
    },
    {
      icon: Gavel,
      label: "Current bid",
      value: formatMoney(item.currentBid),
      accent: true,
    },
    {
      icon: Trophy,
      label: "Winner",
      value: item.winner
        ? `${item.winner.firstName} ${item.winner.lastName}`
        : "No winner yet",
      accent: Boolean(item.winner),
    },
    {
      icon: Truck,
      label: "Shipping",
      value: item.shippingCost
        ? `${formatSnakeCase(item.shippingType)} · ${formatMoney(item.shippingCost)}`
        : formatSnakeCase(item.shippingType),
    },
    {
      icon: Timer,
      label: "Est. delivery",
      value:
        item.shippingEstimatedDays !== null &&
        item.shippingEstimatedDays !== undefined
          ? `${item.shippingEstimatedDays} day${item.shippingEstimatedDays === 1 ? "" : "s"}`
          : "—",
    },
  ];
}
