"use client";

import link from "next/link";
import { Heart, Search, ShoppingBag, User, UserIcon } from "lucide-react";
import { type ReactNode, type SubmitEvent, useState } from "react";
import { SocialLinks, ThemeToggle } from "@/components/shared";
import { useSession, signOut } from "next-auth/react";
// import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { megaMenu } from "@/lib/cms";
import { cartCount, useCart, useUi, useWishlist } from "@/lib/stores";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCurrentUserState } from "@/lib/auth/client";

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
  if (pathname.startsWith("/admin")) return null;

  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="relative z-40 bg-canvas" data-gsap-nav>
      <div className="hidden border-b border-line bg-line/70 text-tiny text-muted sm:block">
        <div className="container-site flex items-center justify-between gap-4 py-2.5">
          <SocialLinks />
          <p className="hidden text-center md:block">
            Free Shipping This Week Order Over - $55
          </p>
          <div className="flex items-center gap-3">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as "usd" | "eur")}
              className="bg-transparent text-tiny text-davys outline-none"
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
              className="bg-transparent text-tiny text-davys outline-none"
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

      <div className="border-b border-line">
        <div className="container-site flex flex-col gap-4 py-5 md:flex-row md:items-center md:gap-8">
          <Link to="/" className="mx-auto md:mx-0" aria-label="Anon home">
            <img src="/images/logo/logo.svg" alt="Anon" className="logo-mark" />
          </Link>

          <form onSubmit={onSearch} className="relative min-w-0 flex-1">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Enter your product name..."
              autoComplete="off"
              suppressHydrationWarning
              className="h-11 w-full rounded-md border border-line bg-surface pr-12 pl-4 text-sm text-onyx outline-none placeholder:text-gray focus:border-salmon"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute top-1/2 right-1 grid size-9 -translate-y-1/2 place-items-center rounded-md bg-surface text-ink hover:text-salmon"
            >
              <Search className="size-5" />
            </button>
          </form>

          <div className="hidden items-center gap-1 md:flex">
            <AccountSlot />
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative grid size-11 place-items-center text-ink hover:text-salmon"
            >
              <Heart className="size-7" />
              <CountBubble count={wish} />
            </Link>
            <button
              type="button"
              aria-label="Open bag"
              onClick={() => setCartOpen(true)}
              className="relative grid size-11 place-items-center text-ink hover:text-salmon"
            >
              <ShoppingBag className="size-7" />
              <CountBubble count={cartCount(items)} />
            </button>
          </div>
        </div>
      </div>

      <nav className="hidden border-b border-line lg:block">
        <ul className="container-site flex items-center justify-center gap-1">
          <li>
            <Link to="/" className="menu-link">
              Home
            </Link>
          </li>
          <li className="group relative">
            <Link to="/shop" className="menu-link">
              Categories
            </Link>
            <div className="invisible absolute top-full left-1/2 z-50 w-[min(72rem,calc(100vw-2rem))] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="grid grid-cols-4 overflow-hidden rounded-md border border-line bg-surface shadow-card">
                {megaMenu.map((col, i) => (
                  <ul
                    key={`${col.title}-${i}`}
                    className="border-r border-line last:border-r-0"
                  >
                    <li>
                      <Link
                        to="/shop"
                        search={searchFromHref(col.href)}
                        className="block border-b border-line px-5 py-3 text-sm font-semibold text-ink hover:text-salmon"
                      >
                        {col.title}
                      </Link>
                    </li>
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link
                          to="/shop"
                          search={searchFromHref(l.href)}
                          className="block px-5 py-2 text-sm text-muted capitalize hover:text-salmon"
                        >
                          {l.label}
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
          </li>
          <li>
            <Link to="/shop" search={{ q: "men" }} className="menu-link">
              Men's
            </Link>
          </li>
          <li>
            <Link to="/shop" search={{ q: "women" }} className="menu-link">
              Women's
            </Link>
          </li>
          <li>
            <Link
              to="/shop"
              search={{ category: "jewelry" }}
              className="menu-link"
            >
              Jewelry
            </Link>
          </li>
          <li>
            <Link
              to="/shop"
              search={{ category: "perfume" }}
              className="menu-link"
            >
              Perfume
            </Link>
          </li>
          <li>
            <Link to="/blog" className="menu-link">
              Blog
            </Link>
          </li>
          <li>
            <Link to="/shop" search={{ badge: "sale" }} className="menu-link">
              Hot Offers
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function AccountSlot() {
  const { user, isPending } = useCurrentUserState();

  if (isPending) {
    return (
      <div
        className="size-11 animate-pulse rounded-full bg-muted"
        aria-hidden="true"
      />
    );
  }

  const href = user ? "/account" : "/login";
  const label = user?.displayName ?? (user ? "Account" : "Sign in");

  return (
    <Link
      href={href}
      aria-label={label}
      className="grid size-11 place-items-center text-foreground transition-colors hover:text-salmon"
    >
      <UserIcon
        size={28}
        strokeWidth={1.5}
      />
    </Link>
  );
}

export default AccountSlot;

function CountBubble({ count }: { count: number }) {
  return (
    <span className="absolute top-0.5 right-0.5 grid min-w-5 place-items-center rounded-full bg-salmon px-1 text-2xs font-semibold text-surface">
      {count}
    </span>
  );
}

function searchFromHref(href: string): { q?: string; category?: string } {
  const q = href.split("q=")[1];
  const c = href.split("category=")[1];
  if (q) return { q };
  if (c) return { category: c };
  return {};
}

type SiteLinkProps = {
  to?: string;
  href?: string;
  search?: Record<string, string>;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
};

function Link({ to, href, search, ...props }: SiteLinkProps) {
  return <Link href={href ?? buildHref(to ?? "/", search)} {...props} />;
}

function buildHref(to: string, search?: Record<string, string>) {
  if (!search || Object.keys(search).length === 0) return to;
  return `${to}?${new URLSearchParams(search).toString()}`;
}
