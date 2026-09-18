import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { parentCategories } from "@/lib/cms/catalog";
import { filterProducts, parseShopSearch } from "@/lib/shop-query";
import { cn } from "@/lib/utils";
import { SortSelect } from "@/components/shared";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const search = parseShopSearch(raw);
  const list = filterProducts(search);

  const title = search.q
    ? `Search: "${search.q}"`
    : search.badge === "sale"
      ? "Hot Offers"
      : search.badge === "new"
        ? "New products"
        : search.category
          ? search.category
          : "Shop";

  return (
    <div className="container mx-auto px-4 py-8">
      <p className="text-tiny text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>{" "}
        / Shop
      </p>

      <div className="mt-3 mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold capitalize">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {list.length} products
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Sort
          <SortSelect value={search.sort ?? "featured"} />
        </label>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Chip
          href="/shop"
          active={!search.category && !search.badge && !search.q}
          label="All"
        />

        {parentCategories.map((category) => (
          <Chip
            key={category.slug}
            href={{
              pathname: "/shop",
              query: {
                category: category.slug,
              },
            }}
            active={search.category === category.slug}
            label={category.label}
          />
        ))}

        <Chip
          href={{
            pathname: "/shop",
            query: {
              badge: "sale",
            },
          }}
          active={search.badge === "sale"}
          label="Sale"
        />
      </div>

      {list.length === 0 ? (
        <p className="border p-10 text-center text-muted-foreground">
          No products match this filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({
  href,
  active,
  label,
}: {
  href: string | { pathname: string; query?: Record<string, string> };
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1.5 text-tiny capitalize transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "text-foreground/80 hover:border-primary hover:text-primary",
      )}
    >
      {label}
    </Link>
  );
}