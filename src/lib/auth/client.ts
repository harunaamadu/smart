"use client";

import { useSession } from "next-auth/react";

/** Normalized user shape used across the app. */
export type AppUser = {
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
  profileImageUrl: string | null;
  isDevFallback: boolean;
};

/**
 * Optional development fallback.
 *
 * Only use this if you intentionally want the app to work without
 * authentication. Otherwise, remove DEV_USER and always require a session.
 */
export const DEV_USER: AppUser = {
  id: "dev-user",
  displayName: "Dev User",
  primaryEmail: "dev@example.com",
  profileImageUrl: null,
  isDevFallback: true,
};

/** Current user plus the session-loading state. */
export type CurrentUserState = {
  /** Null while loading and when signed out. */
  user: AppUser | null;
  /** True while NextAuth is resolving the session. */
  isPending: boolean;
};

/**
 * Returns the currently authenticated user from NextAuth.
 *
 * With NextAuth:
 * - isPending: true  -> session is still loading
 * - user: null       -> loading or signed out
 * - user: AppUser    -> authenticated user
 */
export function useCurrentUserState(): CurrentUserState {
  const { data: session, status } = useSession();

  const user = session?.user;

  return {
    user: user
      ? {
          id: user.id,
          displayName: user.name ?? null,
          primaryEmail: user.email ?? null,
          profileImageUrl: user.image ?? null,
          isDevFallback: false,
        }
      : null,
    isPending: status === "loading",
  };
}

/**
 * Convenience hook for displaying the current user.
 *
 * Example:
 * user?.displayName ?? "Guest"
 */
export function useCurrentUser(): AppUser | null {
  return useCurrentUserState().user;
}