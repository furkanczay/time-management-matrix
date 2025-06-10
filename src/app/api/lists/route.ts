import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lists = await prisma.list.findMany({
      where: {
        creatorId: session.user.id,
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(lists);
  } catch (error) {
    console.error("Error fetching lists:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, color } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Get the current max order for user's lists
    const maxOrderList = await prisma.list.findFirst({
      where: {
        creatorId: session.user.id,
      },
      orderBy: {
        order: "desc",
      },
    });

    const newOrder = (maxOrderList?.order || 0) + 1;

    const list = await prisma.list.create({
      data: {
        title,
        description,
        color: color || "#3b82f6",
        order: newOrder,
        creatorId: session.user.id,
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    return NextResponse.json(list, { status: 201 });
  } catch (error) {
    console.error("Error creating list:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
