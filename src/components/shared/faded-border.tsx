import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FadedBorderProps {
  className?: string;
}

export function FadedBorder({ className }: FadedBorderProps) {
  return (
    <div className={cn("absolute inset-0", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 min-w-2.5 w-[1.5svw] bg-linear-to-r from-background" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 min-w-2.5 w-[1.5svw] bg-linear-to-r to-background" />
    </div>
  );
}
