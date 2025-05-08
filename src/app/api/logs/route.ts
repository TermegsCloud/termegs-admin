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

    const logs = await prisma.log.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
        order: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("[LOGS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 