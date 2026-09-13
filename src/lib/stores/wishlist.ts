
import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  ids: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  setAll: (ids: string[]) => void;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) => {
        const has = get().ids.includes(productId);
        set({
          ids: has ? get().ids.filter((id) => id !== productId) : [...get().ids, productId],
        });
      },
      has: (productId) => get().ids.includes(productId),
      setAll: (ids) => set({ ids }),
    }),
    { name: "smart-wishlist" },
  ),
);