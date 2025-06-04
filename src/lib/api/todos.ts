import { prisma as db } from "@/lib/prisma";
import { getSession } from "../session";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  isUrgent: boolean;
  isImportant: boolean;
  isCompleted: boolean;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to parse quadrant to boolean values
function parseQuadrant(quadrant: string): {
  isUrgent: boolean;
  isImportant: boolean;
} {
  switch (quadrant) {
    case "1":
      return { isUrgent: true, isImportant: true };
    case "2":
      return { isUrgent: false, isImportant: true };
    case "3":
      return { isUrgent: true, isImportant: false };
    case "4":
      return { isUrgent: false, isImportant: false };
    default:
      return { isUrgent: false, isImportant: false };
  }
}

interface GetTodosParams {
  search?: string;
  quadrant?: string;
  isCompleted?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: "order" | "dueDate" | "createdAt";
  sortOrder?: "asc" | "desc";
  filterToday?: boolean;
}

interface CreateTodoParams {
  title: string;
  description?: string;
  isUrgent: boolean;
  isImportant: boolean;
  isCompleted?: boolean;
  dueDate?: Date | null;
}

interface UpdateTodoParams {
  title?: string;
  description?: string;
  isUrgent?: boolean;
  isImportant?: boolean;
  isCompleted?: boolean;
  dueDate?: Date | null;
  order?: number;
}

// GET - Fetch todos
export async function getTodos(params: GetTodosParams = {}) {
  const {
    search,
    quadrant,
    isCompleted,
    limit = 50,
    offset = 0,
    sortBy = "order",
    sortOrder = "asc",
    filterToday = false,
  } = params;

  try {
    const session = await getSession();
    if (!session || !session.user) {
      throw new Error("Unauthorized: No session found");
    }

    // Calculate isUrgent and isImportant from quadrant if provided
    let urgentImportantFilter = {};
    if (quadrant) {
      const { isUrgent, isImportant } = parseQuadrant(quadrant);
      urgentImportantFilter = {
        isUrgent: { equals: isUrgent },
        isImportant: { equals: isImportant },
      };
    }

    // Add today's date filter if enabled
    let dateFilter = {};
    if (filterToday) {
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59
      );

      dateFilter = {
        dueDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      };
    } // Build orderBy based on sortBy parameter
    const orderByClause: Array<Record<string, "asc" | "desc">> = [];

    // Always sort by completion status first (incomplete tasks first)
    orderByClause.push({ completed: "asc" });

    // Then add the requested sort field
    if (sortBy === "dueDate") {
      orderByClause.push({ dueDate: sortOrder });
    } else if (sortBy === "createdAt") {
      orderByClause.push({ createdAt: sortOrder });
    } else {
      // Default sort by order
      orderByClause.push({ order: sortOrder });
    }

    // Add createdAt as final tiebreaker
    if (sortBy !== "createdAt") {
      orderByClause.push({ createdAt: "desc" });
    }
    const todos = await db.task.findMany({
      where: {
        AND: [
          { creatorId: session.user.id }, // Only fetch user's own todos
          search
            ? {
                OR: [
                  { title: { contains: search, mode: "insensitive" } },
                  { description: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
          urgentImportantFilter,
          dateFilter,
          isCompleted !== undefined
            ? { completed: { equals: isCompleted } }
            : {},
        ],
      },
      include: {
        subtasks: true, // Include subtasks in the response
      },
      orderBy: orderByClause,
      take: limit,
      skip: offset,
    }); // Add isCompleted field to each todo and its subtasks
    const todosWithIsCompleted = todos.map((todo) => ({
      ...todo,
      isCompleted: todo.completed,
      subtasks: todo.subtasks.map((subtask) => ({
        ...subtask,
        isCompleted: subtask.completed,
      })),
    }));

    return todosWithIsCompleted;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw new Error("Failed to fetch todos");
  }
}

// POST - Create todo
export async function createTodo(data: CreateTodoParams) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      throw new Error("Unauthorized: No session found");
    }

    // Find the highest order value in the same quadrant for the user
    const existingTodos = await db.task.findMany({
      where: {
        creatorId: session.user.id,
        isUrgent: data.isUrgent,
        isImportant: data.isImportant,
      },
      select: { order: true },
      orderBy: { order: "desc" },
      take: 1,
    });

    const nextOrder = existingTodos.length > 0 ? existingTodos[0].order + 1 : 0;

    const todo = await db.task.create({
      data: {
        title: data.title,
        description: data.description,
        isUrgent: data.isUrgent,
        isImportant: data.isImportant,
        completed: data.isCompleted ?? false,
        dueDate: data.dueDate,
        order: nextOrder,
        createdAt: new Date(),
        updatedAt: new Date(),
        creator: {
          connect: { id: session.user.id },
        },
      },
    });

    // Add isCompleted field to response
    return {
      ...todo,
      isCompleted: todo.completed,
    };
  } catch (error) {
    console.error("Error creating todo:", error);
    throw new Error("Failed to create todo");
  }
}

// PUT - Update todo
export async function updateTodo(id: string, data: UpdateTodoParams) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      throw new Error("Unauthorized: No session found");
    } // Prepare update data
    const updateData: {
      updatedAt: Date;
      title?: string;
      description?: string;
      completed?: boolean;
      isUrgent?: boolean;
      isImportant?: boolean;
      dueDate?: Date | null;
      category?: string;
      order?: number;
    } = {
      updatedAt: new Date(),
    }; // Add individual fields if provided
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.isCompleted !== undefined) updateData.completed = data.isCompleted;
    if (data.isUrgent !== undefined) updateData.isUrgent = data.isUrgent;
    if (data.isImportant !== undefined)
      updateData.isImportant = data.isImportant;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;
    if (data.order !== undefined) updateData.order = data.order;

    const todo = await db.task.update({
      where: {
        id,
        creatorId: session.user.id, // Only update user's own todos
      },
      data: updateData,
    });

    // Add isCompleted field to response
    return {
      ...todo,
      isCompleted: todo.completed,
    };
  } catch (error) {
    console.error("Error updating todo:", error);
    throw new Error("Failed to update todo");
  }
}

// PATCH - Mark as complete/incomplete
export async function toggleTodoComplete(id: string) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      throw new Error("Unauthorized: No session found");
    }

    const currentTodo = await db.task.findUnique({
      where: {
        id,
        creatorId: session.user.id, // Only access user's own todos
      },
    });

    if (!currentTodo) {
      throw new Error("Todo not found");
    }

    const todo = await db.task.update({
      where: {
        id,
        creatorId: session.user.id, // Only update user's own todos
      },
      data: {
        completed: !currentTodo.completed,
        updatedAt: new Date(),
      },
    });

    // Add isCompleted field to response
    return {
      ...todo,
      isCompleted: todo.completed,
    };
  } catch (error) {
    console.error("Error toggling todo completion:", error);
    throw new Error("Failed to toggle todo completion");
  }
}

// DELETE - Delete todo
export async function deleteTodo(id: string) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      throw new Error("Unauthorized: No session found");
    }

    await db.task.delete({
      where: {
        id,
        creatorId: session.user.id, // Only delete user's own todos
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw new Error("Failed to delete todo");
  }
}
