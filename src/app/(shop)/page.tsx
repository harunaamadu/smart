import React from "react";
import {
  BlogRow,
  CategoryRow,
  DealOfDay,
  HeroBanner,
  NewProducts,
  ProductColumns,
  ShopSidebar,
  TestimonialCtaServices,
} from "@/components/home";
import { Footer } from "@/components/layout";

export default function ShopPage() {
  return (
    <main>
      <HeroBanner />
      <CategoryRow />
      <div className="flex items-start  gap-10 container mx-auto px-4 mb-10 relative">
        <ShopSidebar />
        <div className="flex flex-col min-w-0 flex-1">
          <ProductColumns />
          <DealOfDay />
          <NewProducts />
        </div>
      </div>

      <TestimonialCtaServices />
      <BlogRow />
    </main>
  );
}
