"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/client";
import { money, capitalize } from "@/lib/formats";
import { listOrders, type OrderSummary } from "@/lib/server/orders";
import Link from "next/link";

export default function AccountPage() {
  const { user, isPending } = useCurrentUserState();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!user) return;
    listOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoaded(true));
  }, [user]);

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/" });
  }

  if (isPending) return <div className="container mx-auto px-4 py-16 text-sm text-muted-foreground">Loading…</div>;
  if (!user) return <RedirectToSignIn />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user.displayName ?? "Member"}
            {user.primaryEmail ? ` · ${user.primaryEmail}` : ""}
          </p>
        </div>
        <Button variant="outline" disabled={isSigningOut} onClick={handleSignOut}>
          {isSigningOut ? "Signing out…" : "Sign out"}
        </Button>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Orders</h2>
        {!loaded ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading orders…</p>
        ) : orders.length === 0 ? (
          <div className="mt-4 rounded-md border border-border/90 p-8 text-center">
            <p className="text-muted-foreground">No orders yet.</p>
            <Button asChild className="mt-4">
              <Link href="/shop">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="rounded-md border border-border/90 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{order.id}</p>
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs">
                    {capitalize(order.status)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()} · {money(order.total)}
                </p>
                <ul className="mt-3 divide-y divide-line">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 py-2 text-sm">
                      {item.image && (
                        <img src={item.image} alt="" className="size-12 object-contain" />
                      )}
                      <span className="flex-1 capitalize">
                        {item.name} × {item.qty}
                      </span>
                      <span>{money(item.price * item.qty)}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}