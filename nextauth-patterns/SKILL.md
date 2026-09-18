---
name: nextauth-patterns
description: Conventions for this Next.js + NextAuth (v4) + Prisma app's auth system — how to read the current user, protect a page or API route, and check roles. Use this whenever adding a new protected page, a new API route that needs a signed-in user, a role check (CUSTOMER/ADMIN/SELLER), or anything that touches sign-in/sign-up/sessions. Make sure to consult this before writing a new "who is logged in" check by hand, even if the task doesn't mention "auth" explicitly — e.g. "add an endpoint for users to update their profile" or "only admins should see this page" both need it.
---

# Auth patterns for this app

Stack: NextAuth v4 (JWT sessions) + Prisma adapter + Credentials (email/password via bcrypt) + Google OAuth. Roles: `CUSTOMER` (default), `ADMIN`, `SELLER`, stored on `User.role` and mirrored onto the session/JWT.

There is exactly one canonical place for each concern. Don't create a second one — this app already had duplicate hooks and duplicate server helpers with subtly different shapes; consolidate into these instead of adding a new variant.

## Client components: "who is logged in?"

Import from `src/lib/auth/client.ts`. Never call `useSession()` directly elsewhere.

```tsx
import { useCurrentUser, useCurrentUserState, useHasRole } from "@/lib/auth/client";

const user = useCurrentUser(); // AppUser | null
const { user, isPending } = useCurrentUserState(); // when you need the loading state
const isAdmin = useHasRole("ADMIN"); // false while pending, never a false positive
```

`AppUser` is a normalized shape: `{ id, displayName, primaryEmail, profileImageUrl, role, isDevFallback }`. Don't reach into the raw NextAuth `session.user` (`.name`, `.email`) — that shape is coincidental (comes from NextAuth defaults + `next-auth.d.ts` augmentation), the `AppUser` shape is the contract.

## Server: route handlers, server actions, server components

Import from `src/lib/auth/get-user.ts`:

```ts
import { getCurrentUser, requireUser, requireRole, AuthError } from "@/lib/auth/get-user";

// Optional session (anonymous view is fine):
const user = await getCurrentUser(); // User | null

// Route/action that must not run for a signed-out visitor:
export async function POST(request: Request) {
  try {
    const user = await requireUser(); // throws AuthError if signed out
    // ...
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    throw err;
  }
}

// Role-gated route/action (e.g. admin-only):
const admin = await requireRole("ADMIN"); // throws AuthError(403) if wrong role, 401 if signed out
```

This is the pattern used in `src/app/api/orders/route.ts` — copy that file's try/catch shape for any new protected route.

## New protected page (client-rendered gate)

Use `RedirectToSignIn` from `src/lib/auth/gates.tsx` for pages that need a signed-in user but should render nothing meaningful otherwise (mirrors the checkout page):

```tsx
"use client";
import { useCurrentUserState } from "@/lib/auth/client";
import { RedirectToSignIn } from "@/lib/auth/gates";

export default function ProtectedPage() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <Loading />;
  if (!user) return <RedirectToSignIn />;
  // ...
}
```

For a role-gated page, add the same check with `useHasRole` before rendering, or redirect to `/` instead of `/login` if the visitor is signed in but lacks the role.

## New protected server component / layout

Prefer `requireUser()` / `requireRole()` directly — no client hook needed:

```tsx
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("ADMIN"); // throws; wrap the segment in an error boundary or catch+redirect as needed
  return children;
}
```

## Adding a new OAuth provider or credentials field

Edit `src/lib/auth.ts` (the single `authOptions` object). Keep `secret: process.env.NEXTAUTH_SECRET` — required in production, and required env vars belong in `.env.example` alongside the existing `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` pair. If a provider needs new fields on the session/JWT, extend `src/types/next-auth.d.ts` (the `Session`, `User`, `JWT` interfaces) and update `authOptions.callbacks.jwt`/`session` in `auth.ts` to populate them — then extend `AppUser` in `client.ts` to expose the new field.

## Checklist for "add a new protected [page|route|action]"

1. Client-rendered and just needs a signed-in user? → `useCurrentUserState` + `RedirectToSignIn`.
2. Server route/action/component? → `requireUser()` or `requireRole()`, catch `AuthError`.
3. Needs a role check? → `useHasRole` (client) or `requireRole` (server) — don't compare `user.role === "ADMIN"` inline in multiple places.
4. New field needed on the session? → update `next-auth.d.ts` + `auth.ts` callbacks + `AppUser` together, not just one of them.
5. New env var needed? → add it to `.env.example` with a comment on where to get it.