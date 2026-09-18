"use client";

import { MinimalProduct } from "@/components/product/product-card";
import { productsIn } from "@/lib/cms/catalog";
import type { Product } from "@/lib/cms/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import React from "react";
import { cn } from "cn";
import { Button } from "../ui/button";

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function Column({ title, products }: { title: string; products: Product[] }) {
  const pages = chunk(products, 4);
  const [api, setApi] = React.useState<CarouselApi>();
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setIndex(api.selectedScrollSnap());
    const onSelect = () => setIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <Carousel setApi={setApi} opts={{ loop: false }} className="min-w-0">
      <h2 className="mb-3 text-lg font-semibold capitalize">{title}</h2>
      <CarouselContent>
        {pages.map((page, i) => (
          <CarouselItem key={i} className="min-w-full snap-start">
            {page.map((p) => (
              <MinimalProduct key={p._id} product={p} />
            ))}
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="flex items-center justify-center gap-2 mt-4">
        {pages.map((_, i) => (
          <Button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              "h-1.5 p-0 rounded-full transition-all",
              i === index ? "w-8 bg-primary" : "w-4 bg-primary/30",
            )}
          />
        ))}
      </div>
    </Carousel>
  );
}

export function ProductColumns() {
  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      <Column title="New Arrivals" products={productsIn("new-arrivals")} />
      <Column title="Trending" products={productsIn("trending")} />
      <Column title="Top Rated" products={productsIn("top-rated")} />
    </div>
  );
}
