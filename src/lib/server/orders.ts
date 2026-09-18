export type OrderLineItemInput = {
  productId: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  size?: string;
  color?: string;
};

export type PlaceOrderInput = {
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  country: string;
  postalCode: string;
  notes?: string;
  items: OrderLineItemInput[];
};

export type PlaceOrderResult = {
  id: string;
};

export async function placeOrder({ data }: { data: PlaceOrderInput }): Promise<PlaceOrderResult> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Could not place order");
  }

  return res.json();
}