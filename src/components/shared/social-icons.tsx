import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

function IconLink({
  href,
  label,
  children,
  className,
}: {
  href: string;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn("grid size-8 place-items-center text-onyx transition-colors hover:text-salmon", className)}
    >
      {children}
    </Link>
  );
}

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <IconLink href="https://facebook.com" label="Facebook">
        <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
          <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4V10c0-.6.4-1 1-1z" />
        </svg>
      </IconLink>
      <IconLink href="https://x.com" label="X">
        <svg viewBox="0 0 24 24" className="size-3.5 fill-current" aria-hidden>
          <path d="M18.9 2H22l-6.8 7.8L23 22h-6.6l-5.2-6.8L5.6 22H2.5l7.3-8.4L1 2h6.7l4.7 6.2L18.9 2zm-1.2 18h1.8L6.4 3.9H4.4L17.7 20z" />
        </svg>
      </IconLink>
      <IconLink href="https://instagram.com" label="Instagram">
        <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
          <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7zm5 3.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 2A1.8 1.8 0 1 0 13.8 12 1.8 1.8 0 0 0 12 10.2zM17.4 6.4a.9.9 0 1 1-.9.9.9.9 0 0 1 .9-.9z" />
        </svg>
      </IconLink>
      <IconLink href="https://linkedin.com" label="LinkedIn">
        <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
          <path d="M6.5 9H3.7v11h2.8V9zM5.1 4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2zM20.3 20h-2.8v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H10.8V9h2.7v1.5h.1c.4-.7 1.3-1.5 2.8-1.5 3 0 3.5 2 3.5 4.6V20z" />
        </svg>
      </IconLink>
    </div>
  );
}