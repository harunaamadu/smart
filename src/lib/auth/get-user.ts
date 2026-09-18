import "server-only";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@/app/generated/prisma/enums";

/**
 * Canonical server-side "who is logged in" helper. Use this (not a fresh
 * `getServerSession` call) from route handlers, server actions, and server
 * components so there's one place that defines what "current user" means.
 *
 * Returns null when there is no session — callers decide whether that's
 * an error (see `requireUser`) or just an anonymous view.
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
}

/**
 * Like `getCurrentUser`, but throws if there's no session. Use this at the
 * top of any route handler or server action that should never run for a
 * signed-out visitor, e.g.:
 *
 *   export async function POST(request: Request) {
 *     const user = await requireUser(); // throws AuthError -> caught below
 *     ...
 *   }
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError("Unauthorized");
  }
  return user;
}

/**
 * Like `requireUser`, but also checks the user's role. Use this to gate
 * admin/seller-only routes and server actions.
 */
export async function requireRole(role: UserRole) {
  const user = await requireUser();
  if (user.role !== role) {
    throw new AuthError("Forbidden", 403);
  }
  return user;
}

/**
 * Thrown by `requireUser` / `requireRole`. Route handlers should catch this
 * and translate it to a JSON response, e.g.:
 *
 *   } catch (err) {
 *     if (err instanceof AuthError) {
 *       return NextResponse.json({ message: err.message }, { status: err.status });
 *     }
 *     throw err;
 *   }
 */
export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}