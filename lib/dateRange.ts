export type DateRangePreset = "all" | "today" | "7d" | "30d";

export const DATE_RANGE_OPTIONS: {
  value: DateRangePreset;
  label: string;
}[] = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

export function isWithinDateRange(date: string, range: DateRangePreset) {
  if (range === "all") return true;

  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return false;

  const now = new Date();
  if (range === "today") {
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    return value >= startOfDay;
  }

  const days = range === "7d" ? 7 : 30;
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return value >= start;
}
