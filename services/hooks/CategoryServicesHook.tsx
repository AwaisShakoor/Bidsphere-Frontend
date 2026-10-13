"use client";

import { useQuery } from "@tanstack/react-query";

import { getCategories } from "@/services/Api/categoryServicesApi";

export function useCategories() {
  return useQuery({
    queryKey: ["/api/categories"],
    queryFn: getCategories,
  });
}
