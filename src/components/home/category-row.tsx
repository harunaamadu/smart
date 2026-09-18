"use client";

import * as React from "react";
import Link from "next/link";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { categoryTiles } from "@/lib/cms/catalog";
import Image from "next/image";
import { FadedBorder } from "../shared";

export function CategoryRow() {
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <section className="container mx-auto px-4 mb-10 relative text-foreground">
      <FadedBorder />
      <Carousel
        opts={{ loop: true, align: "start", dragFree: true }}
        plugins={
          reduceMotion
            ? []
            : [
                AutoScroll({
                  speed: 0.8,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                  stopOnFocusIn: true,
                }),
              ]
        }
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {categoryTiles.map((c) => (
            <CarouselItem key={c._id} className="basis-auto pl-4">
              <Link
                href={{ pathname: "/shop", query: { category: c.slug } }}
                className="relative group/link flex w-full min-w-44 max-w-xs items-center gap-3 rounded-md border border-border/75 bg-card p-4 hover:border-primary transition-all"
              >
                <div className="relative size-10">
                  <Image
                    src={c.icon}
                    alt=""
                    fill
                    className="dark:invert rounded-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium capitalize min-w-12 truncate">
                    {c.title}
                  </p>
                  <p className="text-xs text-muted-foreground">({c.count})</p>
                </div>
                <span className="ml-auto text-[10px] font-medium group-hover/link:text-primary">
                  Show all
                </span>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
