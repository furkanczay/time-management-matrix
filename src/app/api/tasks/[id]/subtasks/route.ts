import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const session = await getSession();
  //   if (!session) {
  //     return NextResponse.json(
  //       {
  //         message: "Unauthorized",
  //       },
  //       { status: 403 }
  //     );
  //   }
  const { id } = await params;
  try {
    const data = await prisma.task.findFirst({
      where: { id, creatorId: session?.user.id },
      include: { subtasks: true },
    });

    if (!data) {
      return NextResponse.json(
        {
          message: "Not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(data?.subtasks);
  } catch (e) {
    console.log(e);

    return NextResponse.json({ error: "An error occured" }, { status: 500 });
  }
}
