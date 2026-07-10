// src/types/product.types.ts

export interface ProductImage {
  id: number;
  src: string;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  type: string;
  status: string;
  price: string;
  images: ProductImage[];
  regular_price: string;
  sale_price: string;
  manage_stock: boolean;
  stock_quantity: number | null;
}