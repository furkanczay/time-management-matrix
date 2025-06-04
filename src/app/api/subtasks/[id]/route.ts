import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createSubtaskSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

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
  const exist = await prisma.subtask.findFirst({
    where: {
      AND: [
        { id },
        {
          Task: {
            creatorId: session?.user.id,
          },
        },
      ],
    },
  });
  if (!exist) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = await request.json();
  const parse = createSubtaskSchema.safeParse({
    ...exist,
    ...body,
  });

  if (!parse.success) {
    console.log(parse.error);

    return NextResponse.json({ error: parse.error.format() }, { status: 400 });
  }
  const subtask = await prisma.subtask.update({
    where: { id },
    data: {
      ...exist,
      ...parse.data,
    },
  });

  return NextResponse.json(subtask);
}

export async function DELETE(
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

  // Check if subtask exists and user has permission
  const exist = await prisma.subtask.findFirst({
    where: {
      AND: [
        { id },
        {
          Task: {
            creatorId: session?.user.id,
          },
        },
      ],
    },
  });

  if (!exist) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await prisma.subtask.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Subtask deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
