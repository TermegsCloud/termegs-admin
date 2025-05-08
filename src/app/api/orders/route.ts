import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

interface Session {
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { items, total } = body;

    if (!items || !total) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        status: "pending",
        total: parseFloat(total),
        userId: session.user.id,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Create log entry
    await prisma.log.create({
      data: {
        action: "CREATE_ORDER",
        details: `Created order: ${order.id}`,
        userId: session.user.id,
        orderId: order.id,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 