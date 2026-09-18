import { cn } from "@/lib/utils";
import type { ProductBadge } from "@/lib/cms/types";
import { Badge } from "../ui/badge";

export function ProductBadgeTag({
  badge,
  className,
}: {
  badge: ProductBadge;
  className?: string;
}) {
  const tone =
    badge === "sale"
      ? "bg-rose-100 text-rose-500"
      : badge === "new"
        ? "bg-primary text-primary-foreground"
        : "bg-emerald-100 text-emerald-500";
  return (
    <Badge
      className={cn(
        "absolute top-4 left-4 z-10 rounded-sm px-2 py-0.5 text-xs font-medium capitalize",
        tone,
        className,
      )}
    >
      {badge}
    </Badge>
  );
}
