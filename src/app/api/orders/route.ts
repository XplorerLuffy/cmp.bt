import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validation";
import { generateOrderNumber } from "@/lib/orders";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const productIds = data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  if (products.length !== productIds.length) {
    return NextResponse.json({ error: "One or more products were not found" }, { status: 400 });
  }

  for (const item of data.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || !product.isActive || product.outOfStock) {
      return NextResponse.json(
        { error: `"${product?.name ?? "Item"}" is no longer available` },
        { status: 400 }
      );
    }
  }

  const subtotal = data.items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerName: data.customerName,
      phone: data.phone,
      dzongkhag: data.dzongkhag,
      address: data.address,
      email: data.email || null,
      paymentMethod: data.paymentMethod,
      status: data.paymentMethod === "COD" ? "CONFIRMED" : "PENDING_PAYMENT_VERIFICATION",
      subtotal,
      notes: data.notes || null,
      items: {
        create: data.items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          return {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
          };
        }),
      },
    },
  });

  return NextResponse.json({ orderNumber: order.orderNumber }, { status: 201 });
}
