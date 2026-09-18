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
import { type ReactNode } from "react";
import { SocialLinks, ThemeToggle, AppLink } from "@/components/shared";
import { mobileNav, sidebarCategories } from "@/lib/cms/catalog";
import { cartCount, useCart } from "@/lib/stores/cart";
import { useUi } from "@/lib/stores/ui";
import { useWishlist } from "@/lib/stores/wishlist";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "../ui/accordion";
import { MobileAccountSlot } from "../shared/account-slot";

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
      <IconBtn label="Bag" onClick={() => setCartOpen(true)} count={cartCount(items)}>
        <ShoppingBag className="size-6" />
      </IconBtn>

      <Button
        asChild
        size="icon-lg"
        className="-mt-5 p-0 rounded-full bg-primary text-primary-foreground shadow-card"
      >
        <Link href="/" aria-label="Home" className="p-6 h-full aspect-square">
          <Home className="size-6" />
        </Link>
      </Button>

      <Button variant="ghost" size="icon" asChild className="relative size-11 text-muted-foreground">
        <Link href="/wishlist" aria-label="Wishlist">
          <Heart className="size-6" />
          {wish > 0 ? (
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 justify-center rounded-full p-0 text-[10px]">
              {wish}
            </Badge>
          ) : null}
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
      size="icon"
      type="button"
      aria-label={label}
      onClick={onClick}
      className="relative size-11 text-muted-foreground"
    >
      {children}
      {typeof count === "number" && count > 0 ? (
        <Badge className="absolute -top-1 -right-1 h-4 min-w-4 justify-center rounded-full p-0 text-[10px]">
          {count}
        </Badge>
      ) : null}
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
      <Sheet open={mobileMenu} onOpenChange={setMobileMenu}>
        <SheetContent side="left" className="flex w-80 max-w-[85vw] flex-col p-0 lg:hidden">
          <SheetHeader className="border-b px-4 py-4">
            <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-4">
            <Accordion type="multiple" className="w-full">
              {mobileNav.map((item) =>
                item.children ? (
                  <AccordionItem key={item.label} value={item.label} className="border-b border-border/50">
                    <AccordionTrigger className="py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:no-underline">
                      {item.label}
                    </AccordionTrigger>
                    <AccordionContent className="pb-3">
                      <ul>
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <AppLink
                              href={child.href}
                              onClick={() => setMobileMenu(false)}
                              className="block py-1.5 pl-4 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                              {child.label}
                            </AppLink>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  <AppLink
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenu(false)}
                    className="block border-b border-border/50 py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-all"
                  >
                    {item.label}
                  </AppLink>
                ),
              )}
            </Accordion>
          </div>
          <div className="space-y-4 p-4">
            <MobileAccountSlot />
            <div className="mt-auto flex items-center justify-between border-t pt-4 text-muted-foreground">
              <p className="text-sm">Theme</p>
              <ThemeToggle />
            </div>
            <SocialLinks className="mt-4" />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={categoryMenu} onOpenChange={setCategoryMenu}>
        <SheetContent side="left" className="flex w-80 max-w-[85vw] flex-col p-0 lg:hidden">
          <SheetHeader className="border-b px-4 py-4">
            <SheetTitle className="text-lg font-semibold">Category</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto text-muted-foreground">
            <Accordion type="single" collapsible defaultValue="Clothes" className="w-full">
              {sidebarCategories.map((category) => (
                <AccordionItem key={category.title} value={category.title} className="border-b">
                  <AccordionTrigger className="flex cursor-pointer items-center justify-between px-4 py-3 text-left hover:bg-accent hover:no-underline">
                    <span className="flex items-center gap-3 text-sm font-medium">
                      <img src={category.icon} alt="" className="size-5 object-contain" />
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
        </SheetContent>
      </Sheet>
    </>
  );
}