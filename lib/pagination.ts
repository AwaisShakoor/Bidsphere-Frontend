export const DEFAULT_PAGE_SIZE = 10;

export function getPagedItems<T>(
  items: T[],
  page: number,
  pageSize: number = DEFAULT_PAGE_SIZE,
) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(0, page), totalPages - 1);
  const pageItems = items.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize,
  );
  const from = items.length === 0 ? 0 : currentPage * pageSize + 1;
  const to = Math.min(items.length, (currentPage + 1) * pageSize);

  return { pageItems, currentPage, totalPages, from, to };
}
