import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthError, requireUser } from "@/lib/auth/get-user";
import { orderPayloadSchema } from "@/lib/schemas";

const FREE_SHIPPING_THRESHOLD = 55;
const SHIPPING_COST = 6.99;

/** Converts a dollar amount to integer cents, the unit Order/OrderItem store. */
function toCents(dollars: number) {
  return Math.round(dollars * 100);
}

/** Converts stored integer cents back to a dollar amount for the client. */
function toDollars(cents: number) {
  return cents / 100;
}

export async function GET() {
  try {
    const user = await requireUser();

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    return NextResponse.json(
      orders.map((order) => ({
        id: order.id,
        status: order.status,
        total: toDollars(order.total),
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          name: item.productName,
          image: item.productImage,
          price: toDollars(item.price),
          qty: item.quantity,
        })),
      })),
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    throw err;
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();

    const body = await request.json().catch(() => null);
    const parsed = orderPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Invalid order" },
        { status: 400 },
      );
    }

    const { items } = parsed.data;

    // Recompute the total server-side from the submitted line items rather
    // than trusting a client-supplied total — the client only sends prices
    // and quantities, never a total.
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = toCents(subtotal + shipping);

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            productName: item.name,
            productImage: item.image,
            quantity: item.qty,
            price: toCents(item.price),
          })),
        },
      },
      select: { id: true },
    });

    return NextResponse.json({ id: order.id }, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    throw err;
  }
}