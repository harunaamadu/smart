"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { LogOut, User } from "lucide-react";

import { useCurrentUserState } from "@/lib/auth/client";
import { Button } from "../ui/button";

export function AccountSlot() {
  const { user, isPending } = useCurrentUserState();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  async function handleSignOut() {
    try {
      setIsSigningOut(true);
      await signOut({ callbackUrl: "/" });
      toast.success("Signed out successfully");
    } catch {
      toast.error("Failed to sign out");
      setIsSigningOut(false);
    }
  }

  if (isPending) {
    return (
      <div
        className="size-11 animate-pulse rounded-full bg-muted"
        aria-hidden="true"
      />
    );
  }

  if (!user) {
    return (
      <Button variant="ghost" size="icon-lg" asChild className="[&_svg]:size-5!">
        <Link
          href="/login"
          aria-label="Sign in"
          className="group/link grid place-items-center text-foreground transition-colors hover:text-primary"
        >
          <User
            size={28}
            strokeWidth={2}
          />
        </Link>
      </Button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={user.displayName ?? "Account"}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        onClick={() => setMenuOpen((open) => !open)}
        className="group/link grid size-10 place-items-center text-foreground/80 transition-colors hover:text-primary dark:hover:text-foreground"
      >
        <User
          size={28}
          strokeWidth={1.5}
          className="transition-colors group-hover/link:text-primary"
        />
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute top-full right-0 z-50 mt-2 w-48 border border-border bg-background p-1 shadow-lg"
        >
          <Link
            href="/account"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted"
          >
            <User size={18} strokeWidth={1.5} />
            Account
          </Link>

          <button
            type="button"
            role="menuitem"
            disabled={isSigningOut}
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={18} strokeWidth={1.5} />
            {isSigningOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}
