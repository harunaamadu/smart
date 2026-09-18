import { SignupForm } from "@/components/blocks";
import { Suspense } from "react";

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="container-site py-16 text-center text-sm text-muted">Loading…</div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}