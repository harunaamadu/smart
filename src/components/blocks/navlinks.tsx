"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { megaMenu } from "@/lib/cms";

type IndicatorPosition = {
  left: number;
  width: number;
};

const navItems = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/shop", megaMenu: true },
  { label: "Men's", href: "/shop?q=men" },
  { label: "Women's", href: "/shop?q=women" },
  { label: "Jewelry", href: "/shop?category=jewelry" },
  { label: "Perfume", href: "/shop?category=perfume" },
  { label: "Blog", href: "/blog" },
  { label: "Hot Offers", href: "/shop?badge=sale" },
];

export function searchFromHref(href: string): { q?: string; category?: string } {
  const [, query] = href.split("?");
  const params = new URLSearchParams(query ?? "");
  const q = params.get("q");
  const category = params.get("category");
  if (q) return { q };
  if (category) return { category };
  return {};
}

export function shopHref(href: string): string {
  const params = new URLSearchParams(searchFromHref(href));
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export function DesktopNav() {
  const pathname = usePathname();

  const navRef = React.useRef<HTMLUListElement>(null);
  const linkRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);

  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [indicator, setIndicator] =
    React.useState<IndicatorPosition | null>(null);

  const isActive = (index: number) => {
    const item = navItems[index];

    if (item.label === "Home") {
      return pathname === "/";
    }

    if (item.label === "Blog") {
      return pathname.startsWith("/blog");
    }

    return pathname.startsWith("/shop");
  };

  const activeIndex = navItems.findIndex((_, index) => isActive(index));

  const updateIndicator = React.useCallback((index: number) => {
    const nav = navRef.current;
    const link = linkRefs.current[index];

    if (!nav || !link) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    setIndicator({
      left: linkRect.left - navRect.left,
      width: linkRect.width,
    });
  }, []);

  React.useEffect(() => {
    const index = hoveredIndex ?? activeIndex;

    if (index >= 0) {
      updateIndicator(index);
    } else {
      setIndicator(null);
    }
  }, [activeIndex, hoveredIndex, updateIndicator]);

  React.useEffect(() => {
    const handleResize = () => {
      const index = hoveredIndex ?? activeIndex;

      if (index >= 0) {
        updateIndicator(index);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [activeIndex, hoveredIndex, updateIndicator]);

  return (
    <nav className="hidden border-b border-border/90 lg:block">
      <ul
        ref={navRef}
        className="container relative mx-auto px-4 flex items-center justify-center gap-6 py-4 text-foreground"
        onMouseLeave={() => {
          setHoveredIndex(null);
          setIndicator(null);
        }}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-0.5 origin-center bg-primary"
          animate={{
            x: indicator?.left ?? 0,
            width: indicator?.width ?? 0,
            opacity: indicator ? 1 : 0,
            scaleY: indicator ? 1 : 0.5,
          }}
          transition={{
            type: "spring",
            stiffness: 520,
            damping: 24,
            mass: 0.7,
          }}
        />

        {navItems.map((item, index) => (
          <li
            key={item.label}
            className={item.megaMenu ? "group" : "relative"}
            onMouseEnter={() => {
              setHoveredIndex(index);
              updateIndicator(index);
            }}
          >
            <Link
              ref={(element) => {
                linkRefs.current[index] = element;
              }}
              href={item.href}
              className="menu-link"
            >
              {item.label}
            </Link>

            {item.megaMenu && (
              <div className="invisible absolute top-full left-1/2 z-50 w-[min(72rem,calc(100vw-2rem))] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="grid grid-cols-4 overflow-hidden rounded-md border border-border/50 bg-background shadow-2xl">
                  {megaMenu.map((col, i) => (
                    <ul
                      key={`${col.title}-${i}`}
                      className=""
                    >
                      <li>
                        <Link
                          href={shopHref(col.href)}
                          className="block border-b border-border/90 px-5 py-3 text-sm font-normal text-muted-foreground dark:hover:text-foreground hover:text-primary"
                        >
                          {col.title}
                        </Link>
                      </li>

                      {col.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={shopHref(link.href)}
                            className="block px-5 py-2 text-sm text-muted-foreground capitalize hover:text-foreground"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}

                      {col.banner ? (
                        <li className="p-4">
                          <img
                            src={col.banner.src}
                            alt={col.banner.alt}
                            className="w-full rounded-sm object-cover"
                          />
                        </li>
                      ) : null}
                    </ul>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}