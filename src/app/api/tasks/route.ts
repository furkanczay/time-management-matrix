import { Quadrant } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createTaskSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 403 }
    );
  }
  const tasks = await prisma.task.findMany({
    include: { subtasks: true },
    where: { creatorId: session?.user.id },
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parse = createTaskSchema.safeParse(body);
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 403 }
    );
  }
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.format() }, { status: 400 });
  }

  const { title, description, quadrant, completed } = parse.data;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      quadrant: quadrant as Quadrant,
      completed: completed ?? false,
      creator: {
        connect: {
          id: session?.user.id,
        },
      },
    },
  });

  return NextResponse.json(task);
}
