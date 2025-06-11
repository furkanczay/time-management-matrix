import { prisma as db } from "../prisma";

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
  todoId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateSubtaskParams {
  title: string;
  todoId: string;
  isCompleted?: boolean;
}

interface UpdateSubtaskParams {
  title?: string;
  isCompleted?: boolean;
}

// GET - Fetch subtasks
export async function getSubtasks(todoId?: string) {
  try {
    // TODO: Add user authentication when implementing session
    const userId = "temp-user-id"; // Temporary user ID for development
    
    const whereClause: any = {};
    
    if (todoId) {
      // First verify that the todo belongs to the user
      const todo = await db.task.findFirst({
        where: {
          id: todoId,
          creatorId: userId,
        },
      });

      if (!todo) {
        throw new Error("Todo not found or unauthorized");
      }

      whereClause.todoId = todoId;
    } else {
      // If no todoId specified, get subtasks for all user's todos
      const userTodos = await db.task.findMany({
        where: {
          creatorId: userId,
        },
        select: {
          id: true,
        },
      });

      whereClause.todoId = {
        in: userTodos.map(todo => todo.id),
      };
    }
    
    const subtasks = await db.subtask.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "asc",
      },
    });

    // Add isCompleted field for consistency
    const subtasksWithIsCompleted = subtasks.map((subtask) => ({
      ...subtask,
      isCompleted: subtask.completed,
    }));

    return subtasksWithIsCompleted;
  } catch (error) {
    console.error("Error fetching subtasks:", error);
    throw new Error("Failed to fetch subtasks");
  }
}

// POST - Create subtask
export async function createSubtask(data: CreateSubtaskParams) {
  try {
    // TODO: Add user authentication when implementing session
    const userId = "temp-user-id"; // Temporary user ID for development

    // Verify that the todo belongs to the user
    const todo = await db.task.findFirst({
      where: {
        id: data.todoId,
        creatorId: userId,
      },
    });

    if (!todo) {
      throw new Error("Todo not found or unauthorized");
    }

    const subtask = await db.subtask.create({
      data: {
        title: data.title,
        completed: data.isCompleted ?? false,
        todoId: data.todoId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Add isCompleted field for consistency
    return {
      ...subtask,
      isCompleted: subtask.completed,
    };
  } catch (error) {
    console.error("Error creating subtask:", error);
    throw new Error("Failed to create subtask");
  }
}

// PUT - Update subtask
export async function updateSubtask(id: string, data: UpdateSubtaskParams) {
  try {
    // TODO: Add user authentication when implementing session
    const userId = "temp-user-id"; // Temporary user ID for development

    // First verify that the subtask belongs to a todo owned by the user
    const existingSubtask = await db.subtask.findFirst({
      where: {
        id,
      },
      include: {
        todo: {
          select: {
            creatorId: true,
          },
        },
      },
    });

    if (!existingSubtask || existingSubtask.todo.creatorId !== userId) {
      throw new Error("Subtask not found or unauthorized");
    }

    const updateData: {
      updatedAt: Date;
      title?: string;
      completed?: boolean;
    } = {
      updatedAt: new Date(),
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.isCompleted !== undefined) updateData.completed = data.isCompleted;

    const subtask = await db.subtask.update({
      where: {
        id,
      },
      data: updateData,
    });

    // Add isCompleted field for consistency
    return {
      ...subtask,
      isCompleted: subtask.completed,
    };
  } catch (error) {
    console.error("Error updating subtask:", error);
    throw new Error("Failed to update subtask");
  }
}

// DELETE - Delete subtask
export async function deleteSubtask(id: string) {
  try {
    // TODO: Add user authentication when implementing session
    const userId = "temp-user-id"; // Temporary user ID for development

    // First verify that the subtask belongs to a todo owned by the user
    const existingSubtask = await db.subtask.findFirst({
      where: {
        id,
      },
      include: {
        todo: {
          select: {
            creatorId: true,
          },
        },
      },
    });

    if (!existingSubtask || existingSubtask.todo.creatorId !== userId) {
      throw new Error("Subtask not found or unauthorized");
    }

    await db.subtask.delete({
      where: {
        id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting subtask:", error);
    throw new Error("Failed to delete subtask");
  }
}
