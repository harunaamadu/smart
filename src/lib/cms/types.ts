export type ProductBadge = "sale" | "new" | "15%";

export type ProductSection =
  | "bestsellers"
  | "new-arrivals"
  | "trending"
  | "top-rated"
  | "deal"
  | "grid";

export type Product = {
  _type: "product";
  _id: string;
  slug: string;
  title: string;
  category: string;
  parentCategory: string;
  price: number;
  compareAt?: number;
  images: string[];
  rating: number;
  stock: number;
  description: string;
  details: string[];
  badge?: ProductBadge;
  sections: ProductSection[];
  colors?: string[];
  sizes?: string[];
  sold?: number;
  available?: number;
};

export type Banner = {
  _type: "banner";
  _id: string;
  kicker: string;
  title: string;
  priceLabel: string;
  image: string;
  alt: string;
  href: string;
};

export type CategoryTile = {
  _type: "categoryTile";
  _id: string;
  title: string;
  slug: string;
  icon: string;
  count: number;
};

export type BlogPost = {
  _type: "blogPost";
  _id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  dateLabel: string;
  image: string;
  excerpt: string;
  body: string[];
};

export type NavMegaColumn = {
  title: string;
  href: string;
  links: { label: string; href: string }[];
  banner?: { src: string; alt: string };
};