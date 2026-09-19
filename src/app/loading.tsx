import { Logo } from "@/components/shared";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Logo className="size-[30svw] animate-pulse delay-500 text-muted-foreground" aria-label="Loading" />
    </div>
  );
}