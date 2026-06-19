import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import type { OrderStatus } from "@prisma/client";

const VALID_STATUSES = [
  "PENDING_PAYMENT_VERIFICATION",
  "CONFIRMED",
  "PROCESSING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const data: { status?: OrderStatus; paymentVerified?: boolean } = {};

  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    data.status = body.status as OrderStatus;
  }
  if (body.paymentVerified !== undefined) {
    data.paymentVerified = Boolean(body.paymentVerified);
  }

  const order = await prisma.order.update({ where: { id }, data });
  return NextResponse.json(order);
}
