export enum ItemCondition {
  NEW = "NEW",
  LIKE_NEW = "LIKE_NEW",
  GOOD = "GOOD",
  FAIR = "FAIR",
  POOR = "POOR",
}

export const ITEM_CONDITION_OPTIONS = [
  { value: ItemCondition.NEW, label: "New" },
  { value: ItemCondition.LIKE_NEW, label: "Like new" },
  { value: ItemCondition.GOOD, label: "Good" },
  { value: ItemCondition.FAIR, label: "Fair" },
  { value: ItemCondition.POOR, label: "Poor" },
] as const;
