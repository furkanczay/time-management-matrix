import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

// Helper function to calculate quadrant from isUrgent and isImportant
function calculateQuadrant(isUrgent: boolean, isImportant: boolean): string {
  if (isUrgent && isImportant) {
    return "1"; // Urgent & Important
  }
  if (!isUrgent && isImportant) {
    return "2"; // Important & Not Urgent
  }
  if (isUrgent && !isImportant) {
    return "3"; // Urgent & Not Important
  }
  return "4"; // Neither Urgent nor Important
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all tasks for the user
    const tasks = await prisma.task.findMany({
      where: {
        creatorId: session.user.id,
      },
      orderBy: {
        createdAt: "asc", // Order by creation date to maintain some consistency
      },
    });

    console.log(`Found ${tasks.length} tasks to fix order values`);

    // Group tasks by quadrant
    const tasksByQuadrant: Record<string, typeof tasks> = {
      "1": [],
      "2": [],
      "3": [],
      "4": [],
    };

    tasks.forEach((task) => {
      const quadrant = calculateQuadrant(task.isUrgent, task.isImportant);
      tasksByQuadrant[quadrant].push(task);
    });

    // Update order values for each quadrant
    const updatePromises: Promise<any>[] = [];

    Object.entries(tasksByQuadrant).forEach(([quadrant, quadrantTasks]) => {
      console.log(
        `Updating ${quadrantTasks.length} tasks in quadrant ${quadrant}`
      );

      quadrantTasks.forEach((task, index) => {
        updatePromises.push(
          prisma.task.update({
            where: { id: task.id },
            data: { order: index },
          })
        );
      });
    });

    // Execute all updates
    await Promise.all(updatePromises);

    console.log(`Successfully updated order values for ${tasks.length} tasks`);

    return NextResponse.json({
      success: true,
      message: `Order values fixed for ${tasks.length} tasks`,
      updatedCount: tasks.length,
    });
  } catch (error) {
    console.error("Error fixing order values:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fix order values" },
      { status: 500 }
    );
  }
}
