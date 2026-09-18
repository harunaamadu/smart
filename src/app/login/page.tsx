import { LoginForm } from "@/components/blocks";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="container-site py-16 text-center text-sm text-muted">Loading…</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}