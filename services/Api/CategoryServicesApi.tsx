import api from "@/services/api";
import { getErrorMessage } from "@/services/Api/getErrorMessage";
import type { CategoriesResponse } from "@/services/types/CategoryServicesTypes";

export async function getCategories() {
  try {
    const { data } = await api.get<CategoriesResponse>("/api/categories");
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error) || "Failed to load categories");
  }
}
