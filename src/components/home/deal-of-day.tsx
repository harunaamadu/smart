"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AddToCartButton } from "@/components/product/product-card";
import { productsIn } from "@/lib/cms/catalog";
import { money } from "@/lib/formats";
import type { Product } from "@/lib/cms/types";
import { StarRating } from "../shared";
import { Progress } from "../ui/progress";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";

interface Countdown {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

/**
 * Deal products can carry their own `dealEndsAt` (ISO string or epoch ms)
 * from the CMS. This falls back to a shared default only for products that
 * don't set one, so it degrades gracefully instead of breaking the type.
 */
type DealProduct = Product & { dealEndsAt?: string | number };

/** Used only when a product has no dealEndsAt and as the very first paint. */
const FALLBACK_END = Date.UTC(2026, 8, 18, 18, 0, 0);
const SSR_TIME: Countdown = { days: 0, hours: 0, mins: 0, secs: 0 };

function resolveEnd(product: DealProduct): number {
  if (product.dealEndsAt == null) return FALLBACK_END;
  const end =
    typeof product.dealEndsAt === "number"
      ? product.dealEndsAt
      : new Date(product.dealEndsAt).getTime();
  return Number.isFinite(end) ? end : FALLBACK_END;
}

function remaining(end: number): Countdown {
  const diff = Math.max(0, end - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  };
}

function isOver(t: Countdown) {
  return t.days === 0 && t.hours === 0 && t.mins === 0 && t.secs === 0;
}

function useCountdown(end: number): Countdown {
  const [t, setT] = useState<Countdown>(SSR_TIME);

  useEffect(() => {
    let id: number;

    const tick = () => {
      const next = remaining(end);
      setT(next);
      if (isOver(next)) window.clearInterval(id);
    };

    tick();
    id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [end]);

  return t;
}

function DealCard({ product }: { product: DealProduct }) {
  const end = resolveEnd(product);
  const time = useCountdown(end);
  const sold = product.sold ?? 0;
  const available = product.available ?? product.stock ?? 0;
  const total = sold + available;
  const pct = total ? Math.min(100, Math.max(0, (sold / total) * 100)) : 0;
  const ended = isOver(time);

  return (
    <CarouselItem className="flex basis-full lg:basis-1/2 flex-col gap-5 rounded-md border border-border/90 p-5 sm:flex-row">
      <Link href={`/product/${product.slug}`} className="shrink-0">
        <img
          src={product.images[0]}
          alt={product.title}
          className="mx-auto h-48 w-full object-contain"
          loading="lazy"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <StarRating rating={product.rating} />
        <Link
          href={`/product/${product.slug}`}
          className="mt-2 block text-base text-foreground/80 font-medium capitalize hover:text-primary dark:hover:text-foreground"
        >
          {product.title}
        </Link>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor dolor sit
          amet consectetur Lorem ipsum dolor
        </p>
        <p className="mt-3 flex items-center gap-2">
          <span className="text-lg font-semibold text-primary">
            {money(product.price)}
          </span>
          {product.compareAt ? (
            <del className="text-muted-foreground">
              {money(product.compareAt)}
            </del>
          ) : null}
        </p>
        <div className="mt-4">
          <AddToCartButton product={product} />
        </div>
        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <p>
            already sold: <b className="text-foreground">{sold}</b>
          </p>
          <p>
            available: <b className="text-foreground">{available}</b>
          </p>
        </div>
        <Progress
          className="mt-2 overflow-hidden rounded-full"
          role="progressbar"
          value={Math.round(pct)}
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${sold} of ${total} sold`}
        />

        {ended ? (
          <p className="mt-4 text-sm font-medium uppercase text-muted-foreground">
            Offer has ended
          </p>
        ) : (
          <>
            <p className="mt-4 text-sm font-medium uppercase">
              Hurry Up! Offer ends soon:
            </p>
            <div className="mt-3 flex gap-2">
              <TimeBox value={time.days} label="Days" />
              <TimeBox value={time.hours} label="Hours" />
              <TimeBox value={time.mins} label="Min" />
              <TimeBox value={time.secs} label="Sec" />
            </div>
          </>
        )}
      </div>
    </CarouselItem>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="grid min-w-14 place-items-center rounded-md bg-accent px-2 py-2 text-center text-foreground">
      <span className="text-lg font-semibold tabular-nums font-mono">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-xs uppercase text-muted-foreground">{label}</span>
    </div>
  );
}

export function DealOfDay() {
  const deals = productsIn("deal") as DealProduct[];

  return (
    <Carousel className="mt-10" opts={{ loop: false, align: "start", dragFree: true }}>
      <h2 className="mb-4 text-lg font-semibold">Deal of the day</h2>
      <CarouselContent className="pb-3 ml-1 gap-2">
        {deals.map((p) => (
          <DealCard key={p._id} product={p} />
        ))}
      </CarouselContent>
    </Carousel>
  );
}