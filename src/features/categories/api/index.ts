import apiClient from "@/lib/api/client";
import { Category, CategoryType, CreateCategoryPayload, UpdateCategoryPayload } from "../types";

export const getCategories = async (type?: CategoryType): Promise<Category[]> => {
  const response = await apiClient.get("/categories", {
    params: type ? { type } : undefined,
  });
  const data = response.data?.data ?? response.data;
  return Array.isArray(data) ? data : [];
};

export const getCategory = async (id: string): Promise<Category> => {
  const response = await apiClient.get(`/categories/${id}`);
  return response.data?.data ?? response.data;
};

export const createCategory = async (payload: CreateCategoryPayload): Promise<Category> => {
  const response = await apiClient.post("/categories", payload);
  return response.data?.data ?? response.data;
};

export const updateCategory = async (id: string, payload: UpdateCategoryPayload): Promise<Category> => {
  const response = await apiClient.patch(`/categories/${id}`, payload);
  return response.data?.data ?? response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};
