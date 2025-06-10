import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: Context) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const list = await prisma.list.findFirst({
      where: {
        id,
        creatorId: session.user.id,
      },
      include: {
        tasks: {
          include: {
            subtasks: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    return NextResponse.json(list);
  } catch (error) {
    console.error("Error fetching list:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const { title, description, color } = await request.json();

    const list = await prisma.list.findFirst({
      where: {
        id,
        creatorId: session.user.id,
      },
    });

    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    const updatedList = await prisma.list.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(color && { color }),
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    return NextResponse.json(updatedList);
  } catch (error) {
    console.error("Error updating list:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const list = await prisma.list.findFirst({
      where: {
        id,
        creatorId: session.user.id,
      },
    });

    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    // Liste silindiğinde tasks'lar listId null olacak (onDelete: SetNull)
    await prisma.list.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting list:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
