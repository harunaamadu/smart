"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { Heart, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  AddToCartButton,
  ProductCard,
} from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { getProduct, relatedProducts } from "@/lib/cms/catalog";
import { money } from "@/lib/formats";
import { useCart } from "@/lib/stores/cart";
import { useUi } from "@/lib/stores/ui";
import { useWishlist } from "@/lib/stores/wishlist";
import { cn } from "@/lib/utils";
import { StarRating } from "@/components/shared";
import Image from "next/image";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { ProductRatingSection } from "@/components/blocks";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProduct(slug);

  // Throws to the nearest not-found.tsx boundary — must run before any hooks below.
  if (!product) {
    notFound();
  }

  const [image, setImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(product.sizes?.[0]);
  const [color, setColor] = useState(product.colors?.[0]);
  const add = useCart((s) => s.add);
  const setCartOpen = useUi((s) => s.setCartOpen);
  const wished = useWishlist((s) => s.ids.includes(product._id));
  const toggleWish = useWishlist((s) => s.toggle);
  const related = relatedProducts(product);

  return (
    <div className="container mx-auto px-4 py-8">
      <p className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>{" "}
        /{" "}
        <Link
          href={{
            pathname: "/shop",
            query: { category: product.parentCategory },
          }}
          className="capitalize hover:text-primary"
        >
          {product.parentCategory}
        </Link>{" "}
        / <span className="capitalize">{product.title}</span>
      </p>

      <div className="mt-6 flex flex-col gap-10">
        <div className="grid gap-10 lg:grid-cols-[32rem_1fr]">
          <div>
            <motion.div
              key={product.images[image]}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              className="relative overflow-hidden rounded-md aspect-3/4 w-full border border-border/90 bg-background"
            >
              <Image
                src={product.images[image]}
                alt={product.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </motion.div>
            {product.images.length > 1 ? (
              <div className="mt-3 flex gap-2">
                {product.images.map((src, i) => (
                  <Button
                    variant={"ghost"}
                    key={src}
                    type="button"
                    onClick={() => setImage(i)}
                    className={cn(
                      "size-28 overflow-hidden rounded-sm border",
                      i === image ? "border-primary" : "border-border",
                    )}
                  >
                    <img
                      src={src}
                      alt={`${product.title} thumbnail ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </Button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              {product.category}
            </p>
            <h1 className="mt-2 text-2xl font-semibold capitalize">
              {product.title}
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <StarRating rating={product.rating} />
              <span className="text-xs text-muted">
                {product.stock} in stock
              </span>
            </div>
            <p className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-semibold text-primary">
                {money(product.price)}
              </span>
              {product.compareAt ? (
                <del className="text-muted-foreground">
                  {money(product.compareAt)}
                </del>
              ) : null}
            </p>
            <p className="mt-5 max-w-prose text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-davys">
              {product.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>

            {product.sizes ? (
              <fieldset className="mt-6">
                <legend className="mb-2 text-xs font-semibold uppercase">
                  Size
                </legend>
                <ButtonGroup>
                  {product.sizes.map((s) => (
                    <Button
                      variant="ghost"
                      size="icon"
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={cn(
                        "size-10 rounded-sm border text-sm transition-all",
                        size === s
                          ? "border-primary/50 bg-muted text-primary/80"
                          : "border-border hover:border-primary",
                      )}
                    >
                      {s}
                    </Button>
                  ))}
                </ButtonGroup>
              </fieldset>
            ) : null}

            {product.colors ? (
              <fieldset className="mt-4">
                <legend className="mb-2 text-xs font-semibold uppercase">
                  Color
                </legend>
                <ButtonGroup className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <Button
                      key={c}
                      variant="ghost"
                      type="button"
                      onClick={() => setColor(c)}
                      className={cn(
                        "rounded-sm border px-3 py-1.5 text-sm capitalize",
                        color === c
                          ? "border-primary/50 bg-muted text-primary/80"
                          : "border-border hover:border-primary",
                      )}
                    >
                      {c}
                    </Button>
                  ))}
                </ButtonGroup>
              </fieldset>
            ) : null}

            <ButtonGroup className="mt-6 flex items-center">
              <ButtonGroup className="flex items-center rounded-sm border border-border/90">
                <Button
                  type="button"
                  variant="ghost"
                  aria-label="Decrease"
                  className="size-10"
                  onClick={() => setQty((n) => Math.max(1, n - 1))}
                >
                  <Minus className="size-4" />
                </Button>
                <Input
                  readOnly
                  className="w-12 max-w-fit text-center tabular-nums border-0"
                  value={qty}
                />
                <Button
                  type="button"
                  variant="ghost"
                  aria-label="Increase"
                  className="size-10"
                  onClick={() => setQty((n) => n + 1)}
                >
                  <Plus className="size-4" />
                </Button>
              </ButtonGroup>

              <Button
                size="lg"
                className="w-full max-w-40 h-11"
                onClick={() => {
                  add(product, qty, { size, color });
                  setCartOpen(true);
                  toast.success("Added to bag");
                }}
              >
                Add to cart
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="lg"
                aria-label="Wishlist"
                onClick={() => {
                  toggleWish(product._id);
                  toast(wished ? "Removed from wishlist" : "Saved to wishlist");
                }}
                className={cn(
                  "grid size-11 place-items-center rounded-sm border border-line",
                  wished && "text-rose-400 bg-rose-100",
                )}
              >
                <Heart className={cn("size-5", wished && "fill-rose-400")} />
              </Button>
            </ButtonGroup>
          </div>
        </div>

        <ProductRatingSection />
      </div>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-5 text-lg font-semibold">You may also like</h2>
          <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
