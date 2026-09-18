"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { money } from "@/lib/formats";
import { cartCount, cartSubtotal, useCart } from "@/lib/stores/cart";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = cartSubtotal(items);
  const shipping = subtotal >= 55 ? 0 : 6.99;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold">Your bag</h1>
      <p className="mt-1 text-sm text-muted-foreground">{cartCount(items)} items</p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-md border border-line p-12 text-center">
          <p className="text-muted-foreground">Your bag is empty.</p>
          <Button asChild className="mt-4">
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
          <ul className="divide-y divide-border rounded-md border border-line">
            {items.map((item) => (
              <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 p-4">
                <Link href={`/product/${item.slug}`}>
                  <img src={item.image} alt={item.title} className="size-24 object-contain" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${item.slug}`} className="font-medium capitalize hover:text-salmon">
                    {item.title}
                  </Link>
                  {(item.size || item.color) && (
                    <p className="mt-1 text-tiny text-muted-foreground">{[item.size, item.color].filter(Boolean).join(" · ")}</p>
                  )}
                  <p className="mt-2 font-semibold text-salmon">{money(item.price)}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={item.qty <= 1}
                      className="grid size-8 place-items-center rounded-sm border border-line disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => setQty(item.productId, Math.max(1, item.qty - 1), item.size, item.color)}
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-8 text-center tabular-nums">{item.qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      className="grid size-8 place-items-center rounded-sm border border-line"
                      onClick={() => setQty(item.productId, item.qty + 1, item.size, item.color)}
                    >
                      <Plus className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      className="ml-auto grid size-8 place-items-center text-muted-foreground hover:text-sale"
                      onClick={() => remove(item.productId, item.size, item.color)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="h-fit rounded-md border border-line p-5">
            <h2 className="font-semibold">Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{shipping === 0 ? "Free" : money(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 font-semibold">
                <dt>Total</dt>
                <dd>{money(total)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-tiny text-muted-foreground">Free shipping this week on orders over $55.</p>
            <Button asChild className="mt-4 w-full">
              <Link href="/checkout">Checkout</Link>
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}