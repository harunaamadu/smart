"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/client";
import { placeOrder } from "@/lib/server/orders";
import { money } from "@/lib/formats";
import { checkoutSchema } from "@/lib/schemas";
import { cartSubtotal, useCart } from "@/lib/stores/cart";

export default function CheckoutPage() {
  const { user, isPending } = useCurrentUserState();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (isPending)
    return (
      <div className="container-site py-16 text-sm text-muted">Loading…</div>
    );
  if (!user) return <RedirectToSignIn />;

  const subtotal = cartSubtotal(items);
  const shipping = subtotal >= 55 ? 0 : 6.99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container-site py-16 text-center">
        <h1 className="text-2xl font-semibold">Nothing to check out</h1>
        <Button asChild className="mt-4">
          <Link href="/shop">Browse the shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <form
        className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const raw = {
            fullName: String(fd.get("fullName") ?? ""),
            email: String(fd.get("email") ?? ""),
            phone: String(fd.get("phone") ?? ""),
            addressLine: String(fd.get("addressLine") ?? ""),
            city: String(fd.get("city") ?? ""),
            country: String(fd.get("country") ?? ""),
            postalCode: String(fd.get("postalCode") ?? ""),
            notes: String(fd.get("notes") ?? ""),
          };
          const parsed = checkoutSchema.safeParse(raw);
          if (!parsed.success) {
            const next: Record<string, string> = {};
            for (const issue of parsed.error.issues) {
              const key = String(issue.path[0] ?? "form");
              next[key] ??= issue.message;
            }
            setErrors(next);
            toast.error(next.form ?? "Please fix the highlighted fields");
            return;
          }
          setErrors({});
          setPending(true);
          try {
            const result = await placeOrder({
              data: {
                ...parsed.data,
                items: items.map((i) => ({
                  productId: i.productId,
                  name: i.title,
                  image: i.image,
                  price: i.price,
                  qty: i.qty,
                  size: i.size,
                  color: i.color,
                })),
              },
            });
            clear();
            toast.success("Order placed", {
              description: `Order ${result.id}`,
            });
            router.push("/account");
          } catch (err) {
            const message =
              err instanceof Error ? err.message : "Could not place order";
            if (message === "Unauthorized") {
              toast.error("Please sign in to place your order");
              router.push("/login");
            } else {
              toast.error(message);
            }
          } finally {
            setPending(false);
          }
        }}
      >
        <div className="space-y-4 rounded-md border border-border/90 p-5">
          <h2 className="font-semibold">Shipping address</h2>
          {errors.form ? (
            <p
              role="alert"
              className="rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {errors.form}
            </p>
          ) : null}
          <Field
            name="fullName"
            label="Full name"
            error={errors.fullName}
            defaultValue={user.displayName ?? ""}
          />
          <Field
            name="email"
            label="Email"
            type="email"
            error={errors.email}
            defaultValue={user.primaryEmail ?? ""}
          />
          <Field name="phone" label="Phone" error={errors.phone} />
          <Field
            name="addressLine"
            label="Street address"
            error={errors.addressLine}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="city" label="City" error={errors.city} />
            <Field
              name="postalCode"
              label="Postal code"
              error={errors.postalCode}
            />
          </div>
          <Field
            name="country"
            label="Country"
            error={errors.country}
            defaultValue="United States"
          />
          <div className="grid gap-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="w-full rounded-sm border border-line bg-surface px-4 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <aside className="lg:sticky lg:top-8 h-fit rounded-md border border-line p-5">
          <h2 className="font-semibold">Order</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((i) => (
              <li
                key={`${i.productId}-${i.size}-${i.color}`}
                className="flex justify-between gap-3"
              >
                <span className="line-clamp-1 capitalize">
                  {i.title} × {i.qty}
                </span>
                <span>{money(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-line pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : money(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-border/90 pt-2 font-semibold">
              <dt>Total</dt>
              <dd className="text-primary">{money(total)}</dd>
            </div>
          </dl>
          <Button size="lg" type="submit" className="mt-5 w-full" disabled={pending}>
            {pending ? "Placing…" : "Place order"}
          </Button>
        </aside>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  error,
  type = "text",
  defaultValue,
}: {
  name: string;
  label: string;
  error?: string;
  type?: string;
  defaultValue?: string;
}) {
  const errorId = error ? `${name}-error` : undefined;
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
      />
      {error ? (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
