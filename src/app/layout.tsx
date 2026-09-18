import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { DefaultProviders } from "@/components/providers/default-providers";
import { Toaster } from "@/components/ui/sonner";

const interHeading = Inter({ subsets: ["latin"], variable: "--font-heading" });

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart",
  description:
    "Smart — a modern fashion eCommerce store for clothes, footwear, jewelry and more.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans scroll-smooth",
        montserrat.variable,
        interHeading.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col text-foreground bg-background">
        <DefaultProviders>{children}</DefaultProviders>
      </body>
    </html>
  );
}
