"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { ClockArrowDown, LogOut, Settings, User } from "lucide-react";

import { useCurrentUserState } from "@/lib/auth/client";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const accountLinks = [
  { href: "/account", label: "Account", icon: User },
  { href: "/orders", label: "Orders", icon: ClockArrowDown },
  { href: "/settings", label: "Settings", icon: Settings },
];

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
      <Button
        variant="ghost"
        size="icon-lg"
        asChild
        className="[&_svg]:size-5!"
      >
        <Link
          href="/login"
          aria-label="Sign in"
          className="group/link grid place-items-center text-foreground transition-colors hover:text-primary"
        >
          <User size={28} strokeWidth={2} />
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
        {user.profileImageUrl ? (
          <Avatar size="lg">
            {user.profileImageUrl && (
              <AvatarImage
                src={user.profileImageUrl}
                alt={
                  user.displayName
                    ? `${user.displayName}'s profile photo`
                    : "Profile photo"
                }
              />
            )}
            <AvatarFallback>
              {(user.displayName ?? user.primaryEmail ?? "?")
                .charAt(0)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <User
            size={28}
            strokeWidth={1.5}
            className="transition-colors group-hover/link:text-primary"
          />
        )}
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute top-full right-0 z-50 mt-2 w-full min-w-2xs border border-border bg-background p-3.5 shadow-lg"
        >
          <div className="flex items-center justify-between w-full">
            <div className="space-y-1 w-full">
              <b className="line-clamp-1">{user.displayName}</b>
              <p className="text-muted-foreground text-xs line-clamp-1">
                {user.primaryEmail}
              </p>
            </div>

            {user.profileImageUrl && (
              <Avatar size="lg">
                {user.profileImageUrl && (
                  <AvatarImage
                    src={user.profileImageUrl}
                    alt={
                      user.displayName
                        ? `${user.displayName}'s profile photo`
                        : "Profile photo"
                    }
                  />
                )}
                <AvatarFallback>
                  {(user.displayName ?? user.primaryEmail ?? "?")
                    .charAt(0)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>

          <Separator className="my-2" />

          <nav aria-label="Account" className="flex flex-col">
            {accountLinks.map(({ href, label, icon: Icon }) => (
              <Button
                key={label}
                variant="ghost"
                size="lg"
                className="w-full justify-start text-start"
                asChild
              >
                <Link
                  href={href}
                  className="flex items-center gap-2 px-3 py-2 text-sm"
                >
                  <Icon size={18} strokeWidth={1.5} />
                  {label}
                </Link>
              </Button>
            ))}
          </nav>

          <Separator className="my-2" />

          <Button
            variant="destructive"
            size="lg"
            type="button"
            role="menuitem"
            disabled={isSigningOut}
            onClick={handleSignOut}
            className="w-full text-start justify-start gap-2 px-3 py-2 text-sm"
          >
            <LogOut size={18} strokeWidth={1.5} />
            {isSigningOut ? "Signing out..." : "Sign out"}
          </Button>
        </div>
      )}
    </div>
  );
}

export function MobileAccountSlot() {
  const { user, isPending } = useCurrentUserState();
  const pathname = usePathname();
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
      <Button
        variant="ghost"
        size="icon-lg"
        asChild
        className="[&_svg]:size-5!"
      >
        <Link
          href="/login"
          aria-label="Sign in"
          className="group/link grid place-items-center text-foreground transition-colors hover:text-primary"
        >
          <User size={28} strokeWidth={2} />
        </Link>
      </Button>
    );
  }

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <div className="w-full space-y-1">
          <b className="line-clamp-1">{user.displayName}</b>
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {user.primaryEmail}
          </p>
        </div>

        <Avatar className="size-11">
          {user.profileImageUrl ? (
            <AvatarImage
              src={user.profileImageUrl}
              alt={
                user.displayName
                  ? `${user.displayName}'s profile photo`
                  : "Profile photo"
              }
            />
          ) : null}
          <AvatarFallback>
            {(user.displayName ?? user.primaryEmail ?? "?")
              .charAt(0)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <Separator className="my-2" />

      <nav aria-label="Account" className="flex flex-col">
        {accountLinks.map(({ href, label, icon: Icon }) => (
          <Button
            key={label}
            variant="ghost"
            size="lg"
            className="w-full justify-start text-start"
            asChild
          >
            <Link
              href={href}
              className="flex items-center gap-2 px-3 py-2 text-sm"
            >
              <Icon size={18} strokeWidth={1.5} />
              {label}
            </Link>
          </Button>
        ))}
      </nav>

      <Separator className="my-2" />

      <Button
        variant="destructive"
        size="lg"
        type="button"
        disabled={isSigningOut}
        onClick={handleSignOut}
        className="w-full justify-start gap-2 px-3 py-2 text-start text-sm"
      >
        <LogOut size={18} strokeWidth={1.5} />
        {isSigningOut ? "Signing out..." : "Sign out"}
      </Button>
    </div>
  );
}
