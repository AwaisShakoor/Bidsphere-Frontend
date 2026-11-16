import { Bell, CreditCard, Gavel, Trophy, type LucideIcon } from "lucide-react";

export function iconForType(type: string): LucideIcon {
  const key = type.toLowerCase();
  if (key.includes("payment")) return CreditCard;
  if (key.includes("win") || key.includes("won")) return Trophy;
  if (
    key.includes("outbid") ||
    key.includes("bid") ||
    key.includes("auction")
  ) {
    return Gavel;
  }
  return Bell;
}
