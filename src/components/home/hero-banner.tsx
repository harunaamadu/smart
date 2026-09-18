"use client";

import * as React from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { banners } from "@/lib/cms";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export function HeroBanner() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [index, setIndex] = React.useState(0);
  const autoplay = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  );

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
    <section className="container mx-auto px-4 my-4 md:my-8">
      <div className="relative overflow-hidden rounded-md">
        <Carousel setApi={setApi} plugins={[autoplay.current]} opts={{ loop: true }}>
          <CarouselContent>
            {banners.map((b) => (
              <CarouselItem key={b._id}>
                <article className="relative">
                  <img
                    src={b.image}
                    alt={b.alt}
                    className="h-72 w-full object-cover object-right sm:h-96 lg:h-112"
                  />
                  <div className="absolute inset-0 flex items-end p-6 sm:items-center sm:p-10 lg:p-16">
                    <div className="max-w-md rounded-md bg-surface/80 p-5 sm:bg-transparent sm:p-0">
                      <p className="text-sm font-medium capitalize text-primary sm:text-lg">
                        {b.kicker}
                      </p>
                      <h2 className="mt-1 text-xl font-semibold uppercase text-neutral-800 sm:text-3xl lg:text-5xl">
                        {b.title}
                      </h2>
                      <p className="mt-2 hidden text-muted-foreground sm:block sm:text-lg">
                        starting at{" "}
                        <b className="text-2xl font-semibold text-primary">
                          ${b.priceLabel.replace(/^[^\d]+/, "")}
                        </b>
                      </p>
                      <Button size="lg" asChild>
                        <Link
                          href="/shop"
                          className="mt-4 inline-flex px-4 py-2 text-2xs font-semibold uppercase tracking-wider text-surface transition-colors sm:text-xs"
                        >
                          Shop now
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {banners.map((b, i) => (
            <button
              key={b._id}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-2.5 rounded-full transition-all",
                i === index ? "w-8 bg-primary" : "w-2.5 bg-primary/30",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}