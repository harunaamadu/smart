import { MobileBottomNav, MobileDrawers } from "@/components/blocks/mobile-menu";
import { Footer, Header } from "@/components/layout";
import { CartDrawer, NewsletterModal, PurchaseToast } from "@/components/layout/overlays";
import { websiteName } from "@/lib/cms";
import { capitalize } from "@/lib/formats";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: `${capitalize(`websiteName`)} | Modern Fashion Essentials`,
    template: `%s | ${capitalize(`websiteName`)}`,
  },
  description: `Discover ${capitalize(`websiteName`)} — clean, modern fashion for everyday wear. Shop elevated essentials, refined silhouettes, and versatile pieces designed for effortless style.`,
  keywords: [
    `${websiteName}`,
    "modern fashion",
    "minimalist clothing",
    "elevated essentials",
    "contemporary apparel",
    "clean fashion brand",
    "everyday wear",
  ],
};

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-neutral-900">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />

      <MobileBottomNav />
      <MobileDrawers />
      <CartDrawer />
      <NewsletterModal />
      <div className="container mx-auto fixed inset-0 pointer-events-none">
        <PurchaseToast />
      </div>
    </div>
  );
}
