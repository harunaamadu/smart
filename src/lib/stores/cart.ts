import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/cms/types";

export type CartLine = {
  productId: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  qty: number;
  size?: string;
  color?: string;
};

type CartState = {
  items: CartLine[];
  add: (product: Product, qty?: number, opts?: { size?: string; color?: string }) => void;
  setQty: (productId: string, qty: number, size?: string, color?: string) => void;
  remove: (productId: string, size?: string, color?: string) => void;
  clear: () => void;
};

function lineKey(id: string, size?: string, color?: string) {
  return `${id}::${size ?? ""}::${color ?? ""}`;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product, qty = 1, opts) => {
        const key = lineKey(product._id, opts?.size, opts?.color);
        const existing = get().items.find(
          (i) => lineKey(i.productId, i.size, i.color) === key,
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              lineKey(i.productId, i.size, i.color) === key
                ? { ...i, qty: i.qty + qty }
                : i,
            ),
          });
          return;
        }
        set({
          items: [
            ...get().items,
            {
              productId: product._id,
              slug: product.slug,
              title: product.title,
              image: product.images[0] ?? "",
              price: product.price,
              qty,
              size: opts?.size,
              color: opts?.color,
            },
          ],
        });
      },
      setQty: (productId, qty, size, color) => {
        if (qty <= 0) {
          get().remove(productId, size, color);
          return;
        }
        const key = lineKey(productId, size, color);
        set({
          items: get().items.map((i) =>
            lineKey(i.productId, i.size, i.color) === key ? { ...i, qty } : i,
          ),
        });
      },
      remove: (productId, size, color) => {
        const key = lineKey(productId, size, color);
        set({
          items: get().items.filter((i) => lineKey(i.productId, i.size, i.color) !== key),
        });
      },
      clear: () => set({ items: [] }),
    }),
    { name: "smart-cart" },
  ),
);

export function cartCount(items: CartLine[]): number {
  return items.reduce((n, i) => n + i.qty, 0);
}

export function cartSubtotal(items: CartLine[]): number {
  return items.reduce((n, i) => n + i.price * i.qty, 0);
}