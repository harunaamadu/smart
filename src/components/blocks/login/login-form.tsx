"use client";

import { useState, type FormEvent, type SVGProps } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { Logo } from "@/components/shared";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCredentialsSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setPending(false);

    if (result?.error) {
      setError("Incorrect email or password.");
      return;
    }

    toast.success("Signed in");
    router.push(redirectTo);
    router.refresh();
  }

  async function handleGoogleSignIn() {
    setGooglePending(true);
    await signIn("google", { callbackUrl: redirectTo });
  }

  return (
    <div className="container mx-auto relative flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {redirectTo === "/checkout"
              ? "Sign in to continue to checkout."
              : "Sign in to your account."}
          </p>
        </div>

        <Button
          type="button"
          size="lg"
          variant="outline"
          className="w-full gap-2"
          onClick={handleGoogleSignIn}
          disabled={googlePending}
        >
          <GoogleIcon className="size-4" />
          {googlePending ? "Redirecting…" : "Continue with Google"}
        </Button>

        <Marker variant="separator" className="my-6">
          <MarkerContent>or</MarkerContent>
        </Marker>

        <form className="space-y-4" onSubmit={handleCredentialsSubmit}>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? (
            <p role="alert" className="text-tiny text-sale">
              {error}
            </p>
          ) : null}
          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
            className="text-primary dark:text-foreground hover:underline"
          >
            Create one
          </Link>
        </p>

        <Link
          href="/"
          className="absolute top-4 left-4 block w-[10svw] min-w-28 md:left-1/2 md:-translate-x-1/2 md:ml-5"
        >
          <Logo className="w-full h-auto" />
        </Link>
      </div>
    </div>
  );
}

function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.4 14.7 2.4 12 2.4 6.9 2.4 2.7 6.6 2.7 11.6S6.9 20.8 12 20.8c6.9 0 9.3-4.8 9.3-7.3 0-.5 0-.9-.1-1.3H12z"
      />
    </svg>
  );
}
