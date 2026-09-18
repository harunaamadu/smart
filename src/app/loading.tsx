import { Logo } from "@/components/shared";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <Logo className="size-[30svw] animate-spin text-muted-foreground" aria-label="Loading" />
    </div>
  );
}