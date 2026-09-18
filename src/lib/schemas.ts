import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().trim().min(7, "Enter a phone number"),
  addressLine: z.string().trim().min(5, "Enter a street address"),
  city: z.string().trim().min(2, "Enter a city"),
  country: z.string().trim().min(2, "Enter a country"),
  postalCode: z.string().trim().min(3, "Enter a postal code"),
  notes: z.string().trim().max(500).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  message: z.string().trim().min(10, "Write a short message"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name"),
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof signupSchema>;

export const orderPayloadSchema = checkoutSchema.extend({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        name: z.string().min(1),
        image: z.string().min(1),
        price: z.number().nonnegative(),
        qty: z.number().int().positive(),
        size: z.string().optional(),
        color: z.string().optional(),
      }),
    )
    .min(1, "Cart is empty"),
});
