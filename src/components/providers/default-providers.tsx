"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "./auth";
import { QueryClientProvider } from "./query-client";
import { Toaster } from "sonner";
import { TooltipProvider } from "../ui/tooltip";
import { ThemeProvider } from "./theme-provider";

export function DefaultProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <QueryClientProvider>
        <TooltipProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-right" richColors />
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}