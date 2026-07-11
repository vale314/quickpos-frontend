// src/store/cart.store.ts
import { Product } from '@/types/product.types';
import { create } from 'zustand';

// Extendemos el tipo de producto para agregarle la cantidad en el carrito
export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  // Añadir producto al carrito
  addItem: (product) => set((state) => {
    const existingItem = state.items.find((item) => item.id === product.id);
    
    // Si el producto ya está en el carrito, incrementamos su cantidad
    if (existingItem) {
      return {
        items: state.items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    }
    
    // Si es nuevo, lo agregamos al array con cantidad inicial de 1
    return { items: [...state.items, { ...product, quantity: 1 }] };
  }),

  // Eliminar un producto por completo
  removeItem: (productId) => set((state) => ({
    items: state.items.filter((item) => item.id !== productId),
  })),

  // Actualizar la cantidad de forma manual (+ / -)
  updateQuantity: (productId, quantity) => set((state) => ({
    items: state.items.map((item) =>
      item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    ),
  })),

  // Vaciar el carrito (útil al finalizar la venta)
  clearCart: () => set({ items: [] }),

  // Selector matemático para obtener el precio total acumulado
  getTotalPrice: () => {
    return get().items.reduce((total, item) => {
      const price = parseFloat(item.price || '0');
      return total + price * item.quantity;
    }, 0);
  },

  // Selector matemático para contar cuántos productos hay en total
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));