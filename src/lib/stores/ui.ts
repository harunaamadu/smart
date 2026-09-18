import { create } from "zustand";
import { persist } from "zustand/middleware";

type PurchaseToastPayload = {
  title: string;
  image: string;
};

type UiState = {
  mobileMenu: boolean;
  categoryMenu: boolean;
  cartOpen: boolean;
  newsletterOpen: boolean;
  purchaseToast: PurchaseToastPayload | null;
  currency: "usd" | "eur";
  language: "en" | "es" | "fr";
  setMobileMenu: (v: boolean) => void;
  setCategoryMenu: (v: boolean) => void;
  setCartOpen: (v: boolean) => void;
  setNewsletterOpen: (v: boolean) => void;
  showPurchaseToast: (payload: PurchaseToastPayload) => void;
  hidePurchaseToast: () => void;
  setCurrency: (v: "usd" | "eur") => void;
  setLanguage: (v: "en" | "es" | "fr") => void;
};

export const useUi = create<UiState>()(
  persist(
    (set) => ({
      mobileMenu: false,
      categoryMenu: false,
      cartOpen: false,
      newsletterOpen: true,
      purchaseToast: null,
      currency: "usd",
      language: "en",
      setMobileMenu: (mobileMenu) => set({ mobileMenu, categoryMenu: false }),
      setCategoryMenu: (categoryMenu) => set({ categoryMenu, mobileMenu: false }),
      setCartOpen: (cartOpen) => set({ cartOpen }),
      setNewsletterOpen: (newsletterOpen) => set({ newsletterOpen }),
      showPurchaseToast: (purchaseToast) => set({ purchaseToast }),
      hidePurchaseToast: () => set({ purchaseToast: null }),
      setCurrency: (currency) => set({ currency }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "smart-ui",
      partialize: (s) => ({
        newsletterOpen: s.newsletterOpen,
        currency: s.currency,
        language: s.language,
      }),
    },
  ),
);