"use client";

import { toast } from "sonner";
import NextLink from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DesktopNav } from "../blocks/navlinks";
import { AccountSlot } from "../shared/account-slot";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Search, ShoppingBag } from "lucide-react";
import { type ReactNode, type SubmitEvent, useState } from "react";
import { cartCount, useCart, useUi, useWishlist } from "@/lib/stores";
import {
  CountBubble,
  Logo,
  SocialLinks,
  ThemeToggle,
} from "@/components/shared";

export function Header() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const items = useCart((s) => s.items);
  const wish = useWishlist((s) => s.ids.length);
  const setCartOpen = useUi((s) => s.setCartOpen);
  const currency = useUi((s) => s.currency);
  const setCurrency = useUi((s) => s.setCurrency);
  const language = useUi((s) => s.language);
  const setLanguage = useUi((s) => s.setLanguage);

  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  async function handleSignOut() {
    toast.success("Signed out successfully");
    await signOut({ callbackUrl: "/" });
  }

  function onSearch(e: SubmitEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(buildHref("/shop", query ? { q: query } : {}));
  }

  return (
    <header className="relative z-40 bg-background" data-gsap-nav>
      <div className="hidden border-b border-border bg-muted text-muted-foreground sm:block">
        <div className="container mx-auto flex items-center justify-between gap-4 py-1.5 text-xs">
          <SocialLinks />
          <p className="hidden text-center text-sm md:block">
            Free Shipping This Week Order Over - $
            <span className="text-primary font-semibold">500</span>
          </p>
          <div className="flex items-center gap-3">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as "usd" | "eur")}
              className="bg-transparent text-xs text-davys outline-none"
              aria-label="Currency"
            >
              <option value="usd">USD $</option>
              <option value="eur">EUR €</option>
            </select>
            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value as "en" | "es" | "fr")
              }
              className="bg-transparent text-xs text-davys outline-none"
              aria-label="Language"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
            <ThemeToggle className="size-7" />
          </div>
        </div>
      </div>

      <div className="border-b border-b-border/90">
        <div className="container mx-auto flex flex-col gap-4 py-5 md:flex-row md:items-center md:gap-8 px-4">
          <Link
            to="/"
            className="mx-auto md:mx-0 h-auto w-32"
            aria-label="Anon home"
          >
            <Logo />
          </Link>

          <form onSubmit={onSearch} className="relative min-w-0 flex-1">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Enter your product name..."
              autoComplete="off"
              suppressHydrationWarning
              className="h-11 w-full pr-12 pl-4 text-sm outline-none focus-visible:ring-primary caret-primary"
            />
            <Button
              variant="ghost"
              type="submit"
              aria-label="Search"
              className="absolute top-1/2 right-1 grid size-9 -translate-y-1/2 place-items-center rounded-md bg-background text-muted-foreground hover:text-primary"
            >
              <Search className="size-5" />
            </Button>
          </form>

          <div className="hidden items-center gap-4 md:flex text-foreground">
            <AccountSlot />

            <Button
              variant="ghost"
              size="icon-lg"
              asChild
              className="[&_svg]:size-5!"
            >
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="relative group/link grid place-items-center"
              >
                <Heart
                  size={28}
                  strokeWidth={2}
                  className="group-hover/link:text-primary"
                />
                <CountBubble count={wish} />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="Open bag"
              onClick={() => setCartOpen(true)}
              className="relative group/link grid place-items-center [&_svg]:size-5!"
            >
              <ShoppingBag
                size={28}
                strokeWidth={2}
                className="group-hover/link:text-primary"
              />
              <CountBubble count={cartCount(items)} />
            </Button>
          </div>
        </div>
      </div>

      <DesktopNav />
    </header>
  );
}

type SiteLinkProps = {
  to?: string;
  href?: string;
  search?: Record<string, string>;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
};

export function Link({ to, href, search, ...props }: SiteLinkProps) {
  return <NextLink href={href ?? buildHref(to ?? "/", search)} {...props} />;
}

export function buildHref(to: string, search?: Record<string, string>) {
  if (!search || Object.keys(search).length === 0) return to;
  return `${to}?${new URLSearchParams(search).toString()}`;
}
