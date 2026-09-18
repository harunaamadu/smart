import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5 text-amber-400", className)} aria-label={`${rating} of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className="size-3.5"
          fill={i < rating ? "currentColor" : "none"}
          strokeWidth={i < rating ? 0 : 1.6}
        />
      ))}
    </div>
  );
}