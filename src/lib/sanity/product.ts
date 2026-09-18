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
  reviewCount: number;

  stock: number;
  description: string;
  details: string[];

  sections: string[];

  sizes?: string[];
  colors?: string[];
};