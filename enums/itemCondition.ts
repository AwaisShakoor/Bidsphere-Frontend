export enum ItemCondition {
  NEW = "NEW",
  LIKE_NEW = "LIKE_NEW",
  GOOD = "GOOD",
  FAIR = "FAIR",
  POOR = "POOR",
}

export function getItemConditionBadgeClass(condition: ItemCondition) {
  switch (condition) {
    case ItemCondition.NEW:
      return "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200/80";
    case ItemCondition.LIKE_NEW:
      return "bg-sky-100 text-sky-900 ring-1 ring-sky-200/80";
    case ItemCondition.GOOD:
      return "bg-blue-100 text-blue-900 ring-1 ring-blue-200/80";
    case ItemCondition.FAIR:
      return "bg-amber-100 text-amber-950 ring-1 ring-amber-200/80";
    case ItemCondition.POOR:
      return "bg-orange-100 text-orange-950 ring-1 ring-orange-200/80";
    default:
      return "bg-muted text-muted-foreground ring-1 ring-border";
  }
}
