"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function RedirectToSignIn() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const redirectTo = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : "/login";
    router.replace(redirectTo);
  }, [router, pathname]);

  return (
    <div className="container-site py-16 text-center text-sm text-muted">
      Redirecting to sign in…
    </div>
  );
}