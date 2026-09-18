"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { contactSchema } from "@/lib/schemas";

type FieldErrors = Partial<Record<"name" | "email" | "message", string[]>>;

export default function ContactPage() {
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  return (
    <div className="container mx-auto grid gap-10 px-4 py-12 lg:grid-cols-2">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          Contact
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Write to the shop</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          419 State 414 Rte, Beaver Dams, New York (NY), 14812, USA
        </p>
        <p className="mt-2 text-sm">
          <a href="tel:+16079368058" className="hover:text-primary">
            (607) 936-8058
          </a>
          <br />
          <a href="mailto:example@gmail.com" className="hover:text-primary">
            example@gmail.com
          </a>
        </p>
      </div>

      <form
        className="rounded-md border p-6"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const fd = new FormData(form);
          const parsed = contactSchema.safeParse({
            name: String(fd.get("name") ?? ""),
            email: String(fd.get("email") ?? ""),
            message: String(fd.get("message") ?? ""),
          });

          if (!parsed.success) {
            setErrors(parsed.error.flatten().fieldErrors);
            return;
          }

          setErrors({});
          setPending(true);
          window.setTimeout(() => {
            setPending(false);
            toast.success("Message sent; we'll write back soon.");
            form.reset();
          }, 400);
        }}
      >
        <FieldGroup>
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input id="name" name="name" aria-invalid={!!errors.name} />
            <FieldError errors={errors.name?.map((message) => ({ message }))} />
          </Field>

          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" name="email" type="email" aria-invalid={!!errors.email} />
            <FieldError errors={errors.email?.map((message) => ({ message }))} />
          </Field>

          <Field data-invalid={!!errors.message}>
            <FieldLabel htmlFor="message">Message</FieldLabel>
            <Textarea id="message" name="message" rows={6} aria-invalid={!!errors.message} />
            <FieldError errors={errors.message?.map((message) => ({ message }))} />
          </Field>

          <Button type="submit" size="lg" variant="secondary" disabled={pending}>
            {pending ? "Sending…" : "Send message"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}