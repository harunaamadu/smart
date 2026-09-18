"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/cms/catalog";
import { useWishlist } from "@/lib/stores/wishlist";

export default function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Guards against a hydration mismatch: the wishlist store persists to
  // localStorage, so the server always renders an empty list while the
  // client may have saved items — same pattern as NewsletterModal/CartDrawer.
  const list = hydrated ? products.filter((p) => ids.includes(p._id)) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Wishlist</h1>
      <p className="mt-1 text-sm text-muted-foreground">{list.length} saved items</p>
      {list.length === 0 ? (
        <div className="mt-10 rounded-md border p-12 text-center">
          <p className="text-muted-foreground">Save pieces you love • they'll wait here.</p>
          <Button asChild className="mt-4">
            <Link href="/shop">Browse the shop</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}