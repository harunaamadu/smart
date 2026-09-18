"use client"

import Link from "next/link";
import type { ReactNode } from "react";

/** Path + query string → next/link Link, for CMS/footer hrefs. */
export function AppLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link href={href || "/"} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}