import { apiCall } from "./client";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  material?: string;
  tag?: string;
  description?: string;
  image?: string;
}

export const catalogService = {
  async getProducts(params?: {
    category?: string;
    search?: string;
    maxPrice?: number;
    tag?: string;
  }): Promise<{ data?: Product[]; error?: any }> {
    const queryParams = new URLSearchParams();

    if (params?.category) queryParams.append("category", params.category);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.maxPrice) queryParams.append("maxPrice", params.maxPrice.toString());
    if (params?.tag) queryParams.append("tag", params.tag);

    const query = queryParams.toString();
    const endpoint = `/api/v1/products${query ? "?" + query : ""}`;

    return apiCall<Product[]>(endpoint);
  },

  async getProduct(id: string | number): Promise<{ data?: Product; error?: any }> {
    return apiCall<Product>(`/api/v1/products/${id}`);
  },

  async getCategories(): Promise<{ data?: string[]; error?: any }> {
    return apiCall<string[]>("/api/v1/categories");
  },
};
