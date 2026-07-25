import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // ID of the menu_item
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
  notes?: string; // Optional notes added via the modal
}

export interface DeliveryInfo {
  address: string;
  phone: string;
  notes?: string;
}

interface CartStore {
  items: CartItem[];
  deliveryInfo: DeliveryInfo | null;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setDeliveryInfo: (info: DeliveryInfo) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryInfo: null,

      setDeliveryInfo: (info) => set({ deliveryInfo: info }),

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          const quantityToAdd = item.quantity || 1;
          
          if (existingItem) {
            // Update quantity and notes (if provided)
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      quantity: i.quantity + quantityToAdd,
                      notes: item.notes ? item.notes : i.notes,
                    }
                  : i
              ),
            };
          }
          // Add new item
          return { items: [...state.items, { ...item, quantity: quantityToAdd }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], deliveryInfo: null });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "karyys-food-cart", // Key used in localStorage
    }
  )
);
