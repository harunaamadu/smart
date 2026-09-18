import { products } from "@/lib/cms/catalog";
import type { Product, ProductBadge } from "@/lib/cms/types";

export type ShopSearch = {
  q?: string;
  category?: string;
  badge?: string;
  sort?: string;
};

export function parseShopSearch(search: Record<string, unknown>): ShopSearch {
  const str = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : undefined);
  return {
    q: str(search.q),
    category: str(search.category),
    badge: str(search.badge),
    sort: str(search.sort),
  };
}

export function filterProducts(search: ShopSearch): Product[] {
  let list = [...products];
  const q = search.q?.trim().toLowerCase();
  if (q) {
    list = list.filter((p) =>
      [p.title, p.category, p.parentCategory, p.description].join(" ").toLowerCase().includes(q),
    );
  }
  if (search.category) {
    const c = search.category.toLowerCase();
    list = list.filter((p) => p.parentCategory === c || p.category.toLowerCase() === c);
  }
  if (search.badge) {
    const b = search.badge as ProductBadge;
    if (b === "sale") list = list.filter((p) => p.badge === "sale" || p.badge === "15%" || (p.compareAt && p.compareAt > p.price));
    else list = list.filter((p) => p.badge === b);
  }
  switch (search.sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "bestsellers":
      list = list.filter((p) => p.sections.includes("bestsellers")).concat(
        list.filter((p) => !p.sections.includes("bestsellers")),
      );
      break;
    default:
      break;
  }
  return list;
}
