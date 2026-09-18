"use client";

import Link from "next/link";
import {
  ChevronDown,
  Heart,
  Home,
  LayoutGrid,
  Menu,
  ShoppingBag,
  X,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import {
  SocialLinks,
  ThemeToggle,
  AppLink,
  CountBubble,
} from "@/components/shared";
import { mobileNav, sidebarCategories } from "@/lib/cms/catalog";
import { cartCount, useCart } from "@/lib/stores/cart";
import { useUi } from "@/lib/stores/ui";
import { useWishlist } from "@/lib/stores/wishlist";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "../ui/accordion";

export function MobileBottomNav() {
  const items = useCart((s) => s.items);
  const wish = useWishlist((s) => s.ids.length);
  const setMobileMenu = useUi((s) => s.setMobileMenu);
  const setCategoryMenu = useUi((s) => s.setCategoryMenu);
  const setCartOpen = useUi((s) => s.setCartOpen);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-sm items-center justify-evenly border border-border/75 bg-background py-2 shadow-2xl lg:hidden">
      <IconBtn
        label="Menu"
        onClick={() => {
          setCategoryMenu(false);
          setMobileMenu(true);
        }}
      >
        <Menu className="size-6" />
      </IconBtn>
      <IconBtn
        label="Bag"
        onClick={() => setCartOpen(true)}
        count={cartCount(items)}
      >
        <ShoppingBag className="size-6" />
      </IconBtn>
      <Link
        href="/"
        aria-label="Home"
        className="-mt-5 grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-card"
      >
        <Home className="size-6" />
      </Link>

      <Button variant="ghost" size="icon" type="button" asChild>
        <Link
          href="/wishlist"
          aria-label="Wishlist"
          className="relative grid size-11 place-items-center text-muted-foreground"
        >
          <Heart className="size-6" />
          <CountBubble count={wish} />
        </Link>
      </Button>

      <IconBtn
        label="Categories"
        onClick={() => {
          setMobileMenu(false);
          setCategoryMenu(true);
        }}
      >
        <LayoutGrid className="size-6" />
      </IconBtn>
    </nav>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  count,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  count?: number;
}) {
  return (
    <Button
      variant="ghost"
      type="button"
      aria-label={label}
      onClick={onClick}
      className="relative grid size-11 place-items-center text-muted-foreground"
    >
      {children}
      {typeof count === "number" ? <CountBubble count={count} /> : null}
    </Button>
  );
}

export function MobileDrawers() {
  const mobileMenu = useUi((s) => s.mobileMenu);
  const categoryMenu = useUi((s) => s.categoryMenu);
  const setMobileMenu = useUi((s) => s.setMobileMenu);
  const setCategoryMenu = useUi((s) => s.setCategoryMenu);

  return (
    <>
      <Backdrop
        open={mobileMenu || categoryMenu}
        onClose={() => {
          setMobileMenu(false);
          setCategoryMenu(false);
        }}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-60 flex w-sm max-w-full flex-col bg-popover shadow-2xl transition-transform duration-200 lg:hidden",
          mobileMenu ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <DrawerHead title="Menu" onClose={() => setMobileMenu(false)} />
        <div className="flex-1 overflow-y-auto p-4">
          {mobileNav.map((item) => (
            <MobileAccordion
              key={item.label}
              item={item}
              onNavigate={() => setMobileMenu(false)}
            />
          ))}
        </div>
        <div className="p-4 space-y-4">
          <div className="mt-auto flex items-center justify-between border-t border-line pt-4 text-muted-foreground">
            <p className="text-sm">Theme</p>
            <ThemeToggle />
          </div>
          <SocialLinks className="mt-4" />
        </div>
      </aside>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-60 flex w-sm max-w-full flex-col bg-popover shadow-toast transition-transform duration-200 lg:hidden",
          categoryMenu ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <DrawerHead title="Category" onClose={() => setCategoryMenu(false)} />

        <div className="flex-1 overflow-y-auto text-muted-foreground">
          <Accordion
            type="single"
            collapsible
            defaultValue={"Clothes"}
            className="w-full"
          >
            {sidebarCategories.map((category) => (
              <AccordionItem
                key={category.title}
                value={category.title}
                className="border-b border-line"
              >
                <AccordionTrigger className="flex cursor-pointer items-center justify-between px-4 py-3 text-left hover:bg-accent hover:no-underline">
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <img
                      src={category.icon}
                      alt=""
                      className="size-5 object-contain"
                    />

                    {category.title}
                  </span>
                </AccordionTrigger>

                <AccordionContent className="[&_a]:no-underline!">
                  <ul>
                    {category.items.map((item) => (
                      <li key={item.name}>
                        <AppLink
                          href={item.href}
                          onClick={() => setCategoryMenu(false)}
                          className="flex items-center justify-between px-12 py-1.5 text-sm capitalize transition-colors hover:text-primary!"
                        >
                          <span>{item.name}</span>
                          <span>{item.stock}</span>
                        </AppLink>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </aside>
    </>
  );
}

function DrawerHead({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/75 px-4 py-4">
      <h2 className="text-lg text-foreground font-semibold">{title}</h2>
      <Button
        variant="ghost"
        size="icon-lg"
        type="button"
        aria-label="Close"
        onClick={onClose}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}

function MobileAccordion({
  item,
  onNavigate,
}: {
  item: (typeof mobileNav)[number];
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  if (!item.children) {
    return (
      <AppLink
        href={item.href}
        onClick={onNavigate}
        className="block border-b border-border/50 py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-all"
      >
        {item.label}
      </AppLink>
    );
  }
  return (
    <div className="border-b border-border/50 transition-all">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3 text-sm font-medium  text-muted-foreground hover:text-primary"
      >
        {item.label}
        <ChevronDown
          className={cn("size-4 transition-all", open && "rotate-180")}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: {
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
              },
              opacity: {
                duration: 0.2,
              },
            }}
            className="overflow-hidden pb-3"
          >
            {item.children.map((child) => (
              <li key={child.label}>
                <AppLink
                  href={child.href}
                  onClick={onNavigate}
                  className="block py-1.5 pl-4 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {child.label}
                </AppLink>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function Backdrop({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <button
      type="button"
      aria-label="Close overlay"
      onClick={onClose}
      className={cn(
        "fixed inset-0 z-50 bg-neutral-900/40 transition-opacity lg:hidden",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    />
  );
}
