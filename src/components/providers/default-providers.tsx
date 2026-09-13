"use client";

import { AuthProvider } from "./auth";
import { QueryClientProvider } from "./query-client";
import { Toaster } from "sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { TooltipProvider } from "../ui/tooltip";

export function DefaultProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QueryClientProvider>
        <TooltipProvider>
          <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            // disableTransitionOnChange
          >
            {children}
            <Toaster />
          </NextThemesProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
