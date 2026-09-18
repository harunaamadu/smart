"use client";

import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { newsletterSchema } from "@/lib/schemas";
import { cartCount, cartSubtotal, useCart } from "@/lib/stores/cart";
import { useUi } from "@/lib/stores/ui";
import { money } from "@/lib/formats";

export function NewsletterModal() {
  const open = useUi((s) => s.newsletterOpen);
  const setOpen = useUi((s) => s.setNewsletterOpen);
  const [email, setEmail] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="grid min-w-xl gap-0 overflow-hidden p-0 md:grid-cols-2">
        <img
          src="/images/newsletter.png"
          alt="Subscribe newsletter"
          className="hidden h-full max-h-112 w-full object-cover md:block"
        />
        <form
          className="flex flex-col justify-center gap-3 p-8 text-center min-w-full"
          onSubmit={(e) => {
            e.preventDefault();
            const parsed = newsletterSchema.safeParse({ email });
            if (!parsed.success) {
              toast.error(parsed.error.issues[0]?.message ?? "Invalid email");
              return;
            }
            toast.success("You're on the list");
            setEmail("");
            setOpen(false);
          }}
        >
          <h2 className="text-xl font-semibold uppercase">Subscribe Newsletter</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Subscribe the Anon to get latest products and discount update.
          </p>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="text-center"
          />
          <Button type="submit" variant="link" className="w-full">
            Subscribe
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function PurchaseToast() {
  const purchase = useUi((s) => s.purchaseToast);
  const hide = useUi((s) => s.hidePurchaseToast);

  useEffect(() => {
    if (!purchase) return;
    const timer = setTimeout(hide, 6000);
    return () => clearTimeout(timer);
  }, [purchase, hide]);

  if (!purchase) return null;

  return (
    <div className="pointer-events-auto absolute top-4 md:top-auto md:bottom-14 left-8 z-40 flex w-[min(100%-2.5rem,18.75rem)] items-start gap-3 rounded-md border bg-background p-4 shadow-lg">
      <img src={purchase.image} alt={purchase.title} className="size-18 rounded-sm border object-contain" />
      <div className="min-w-0 pr-4">
        <p className="text-xs text-muted-foreground">Order confirmed</p>
        <p className="text-sm font-medium text-foreground">{purchase.title}</p>
        <p className="text-xs text-muted-foreground">Just now</p>
      </div>
      <Button
        type="button"
        aria-label="Dismiss"
        variant="ghost"
        size="icon"
        className="absolute top-2.5 right-2.5 size-6 text-muted-foreground hover:text-foreground"
        onClick={hide}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}

export function CartDrawer() {
  const open = useUi((s) => s.cartOpen);
  const setOpen = useUi((s) => s.setCartOpen);
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const count = cartCount(items);
  const subtotal = cartSubtotal(items);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-[min(100%,24rem)] flex-col p-0">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="text-lg font-semibold">Your bag ({count})</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">Your bag is empty.</p>
          ) : (
            <ul className="divide-y">
              {items.map((item) => (
                <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3 p-4">
                  <Link href={`/product/${item.slug}`} onClick={() => setOpen(false)}>
                    <img src={item.image} alt={item.title} className="size-16 object-contain" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={() => setOpen(false)}
                      className="line-clamp-2 text-sm capitalize hover:text-primary"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-sm font-semibold text-primary">{money(item.price)}</p>
                    {(item.size || item.color) && (
                      <p className="text-xs text-muted-foreground">
                        {[item.size, item.color].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        type="button"
                        aria-label="Decrease"
                        variant="outline"
                        size="icon"
                        className="size-7"
                        disabled={item.qty <= 1}
                        onClick={() => setQty(item.productId, item.qty - 1, item.size, item.color)}
                      >
                        <Minus className="size-3" />
                      </Button>
                      <span className="w-6 text-center text-sm tabular-nums">{item.qty}</span>
                      <Button
                        type="button"
                        aria-label="Increase"
                        variant="outline"
                        size="icon"
                        className="size-7"
                        onClick={() => setQty(item.productId, item.qty + 1, item.size, item.color)}
                      >
                        <Plus className="size-3" />
                      </Button>
                      <button
                        type="button"
                        className="ml-auto text-xs text-muted-foreground hover:text-destructive"
                        onClick={() => remove(item.productId, item.size, item.color)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <SheetFooter className="border-t p-5 sm:flex-col">
          <div className="mb-4 flex w-full justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">{money(subtotal)}</span>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Free shipping this week on orders over $55.
          </p>
          <div className="flex w-full flex-col gap-2">
            <Button asChild size="lg" className="w-full">
              <Link href="/cart" onClick={() => setOpen(false)}>
                View bag
              </Link>
            </Button>
            <Button asChild size="lg" variant="link" className="w-full">
              <Link href="/checkout" onClick={() => setOpen(false)}>
                Checkout
              </Link>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}