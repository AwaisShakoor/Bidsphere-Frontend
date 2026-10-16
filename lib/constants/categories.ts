import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Building2,
  Car,
  CircuitBoard,
  Gem,
  Home,
  LayoutGrid,
  MoreHorizontal,
  Palette,
  Shirt,
  Trophy,
} from "lucide-react";

export const ALL_CATEGORIES_ICON = LayoutGrid;

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  electronics: CircuitBoard,
  "fashion-apparel": Shirt,
  "collectibles-art": Palette,
  vehicles: Car,
  "real-estate": Building2,
  "jewelry-watches": Gem,
  "books-media": BookOpen,
  "sports-outdoors": Trophy,
  "home-garden": Home,
  other: MoreHorizontal,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] ?? MoreHorizontal;
}
