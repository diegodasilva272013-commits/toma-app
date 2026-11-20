// src/store/cartStore.ts
import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  image_url?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: any, restaurantId: string, restaurantName: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (product, restaurantId, restaurantName) => {
    const existingItem = get().items.find((item) => item.id === product.id);

    if (existingItem) {
      set({
        items: get().items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({
        items: [
          ...get().items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            restaurantId,
            restaurantName,
            image_url: product.image_url,
          },
        ],
      });
    }
  },

  removeItem: (productId) => {
    set({
      items: get().items.filter((item) => item.id !== productId),
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
    } else {
      set({
        items: get().items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        ),
      });
    }
  },

  clearCart: () => {
    set({ items: [] });
  },

  totalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  itemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
