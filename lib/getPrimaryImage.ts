export function getPrimaryImage<T extends { sortOrder: number }>(
  images: readonly T[] | null | undefined,
): T | null {
  if (!images?.length) return null;
  return [...images].sort((a, b) => a.sortOrder - b.sortOrder)[0] ?? null;
}
