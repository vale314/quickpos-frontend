// src/api/products.api.ts
import { Product } from '@/types/product.types';
import { apiClient } from './client';

export const productsApi = {
  // Pide una página específica, por defecto la 1
  getProducts: async (page: number = 1): Promise<Product[]> => {
    const response = await apiClient.get(`/products?page=${page}`);
    return response.data;
  },
};