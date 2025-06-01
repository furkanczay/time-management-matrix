import { Quadrant } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createTaskSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 403 }
    );
  }
  const { id } = await params;
  const task = await prisma.task.findFirst({
    where: {
      AND: [{ id }, { creatorId: session?.user.id }],
    },
    include: {
      subtasks: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!task)
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  return NextResponse.json(task);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 403 }
    );
  }
  const { id } = await params;
  const exist = await prisma.task.findFirst({
    where: {
      AND: [{ id }, { creatorId: session?.user.id }],
    },
  });
  if (!exist) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = await request.json();
  const parse = createTaskSchema.safeParse({
    ...exist,
    ...body,
  });

  if (!parse.success) {
    console.log(parse.error);

    return NextResponse.json({ error: parse.error.format() }, { status: 400 });
  }

  // Ensure quadrant is of the correct enum type
  const task = await prisma.task.update({
    where: { id, creatorId: session?.user.id },
    data: {
      ...exist,
      ...parse.data,
      quadrant:
        (parse.data.quadrant as Quadrant) || (exist.quadrant as Quadrant), // Replace 'any' with 'Quadrant' if you have the enum imported
    },
  });

  return NextResponse.json(task);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 403 }
    );
  }

  try {
    await prisma.task.delete({
      where: {
        id,
        creatorId: session?.user.id,
      },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.log(e);

    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
}
