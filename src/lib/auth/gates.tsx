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

// export function UserButton() {
//   const user = useCurrentUser();
//   // Sign-out can take a moment (and can fail when deployed), so the control
//   // shows it is working and cannot be fired twice.
//   const [signingOut, setSigningOut] = useState(false);
//   const gateSession = useSyncExternalStore(
//     subscribeToNothing,
//     hasGateSessionMarker,
//     noGateSessionOnServer,
//   );
//   if (!user) return null;
//   const label = user.displayName ?? user.primaryEmail ?? "Account";
//   return (
//     <div className="flex items-center gap-2">
//       {user.profileImageUrl ? (
//         <img
//           src={user.profileImageUrl}
//           alt=""
//           className="h-8 w-8 rounded-full object-cover"
//         />
//       ) : (
//         <span className="grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20">
//           {label.charAt(0).toUpperCase()}
//         </span>
//       )}
//       <span className="text-sm font-medium">{label}</span>
//       {authEnabled && !gateSession && (
//         <button
//           type="button"
//           disabled={signingOut}
//           onClick={() => {
//             setSigningOut(true);
//             // Success navigates away; on failure re-enable so it can be retried.
//             void signOut().catch(() => setSigningOut(false));
//           }}
//           className="cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline"
//         >
//           {signingOut ? "Signing out…" : "Sign out"}
//         </button>
//       )}
//     </div>
//   );
// }
