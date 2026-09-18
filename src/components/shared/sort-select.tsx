"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "bestsellers", label: "Best sales" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <select
      className="h-10 rounded-sm border bg-background px-3 text-foreground"
      value={value}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams.toString());
        if (e.target.value === "featured") {
          params.delete("sort");
        } else {
          params.set("sort", e.target.value);
        }
        const qs = params.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname);
      }}
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}