import api from "@/lib/api";
import type {
  CategoriesResponse,
  Category,
} from "@/services/types/CategoryServicesTypes";

export async function getCategories() {
  const { data } = await api.get<CategoriesResponse | Category[]>(
    "/api/categories",
  );

  if (Array.isArray(data)) {
    return data;
  }

  return data.categories ?? [];
}
