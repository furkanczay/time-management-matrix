import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createSubtaskSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 403 }
    );
  }
  const body = await request.json();
  const parse = createSubtaskSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.format() }, { status: 400 });
  }
  const existParent = await prisma.task.findFirst({
    where: { id: parse.data.parentId, creatorId: session?.user.id },
  });

  if (!existParent) {
    return NextResponse.json(
      {
        message: "Not found",
      },
      { status: 404 }
    );
  }
  try {
    const subtask = await prisma.subtask.create({
      data: {
        Task: {
          connect: {
            id: parse.data.parentId,
          },
        },
        title: parse.data.title,
        completed: parse.data.completed,
      },
    });
    return NextResponse.json(subtask);
  } catch {
    return NextResponse.json({ error: "An error occured" }, { status: 500 });
  }
}
