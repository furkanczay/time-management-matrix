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
  listId?: string | null;
}

interface UpdateTodoParams {
  title?: string;
  description?: string;
  isUrgent?: boolean;
  isImportant?: boolean;
  isCompleted?: boolean;
  dueDate?: Date | null;
  order?: number;
  listId?: string | null;
}

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

    let urgentImportantFilter = {};
    if (quadrant) {
      const { isUrgent, isImportant } = parseQuadrant(quadrant);
      urgentImportantFilter = {
        isUrgent: { equals: isUrgent },
        isImportant: { equals: isImportant },
      };
    }

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
    }
    const orderByClause: Array<Record<string, "asc" | "desc">> = [];

    orderByClause.push({ completed: "asc" });

    if (sortBy === "dueDate") {
      orderByClause.push({ dueDate: sortOrder });
    } else if (sortBy === "createdAt") {
      orderByClause.push({ createdAt: sortOrder });
    } else {
      orderByClause.push({ order: sortOrder });
    }

    if (sortBy !== "createdAt") {
      orderByClause.push({ createdAt: "desc" });
    }
    const todos = await db.task.findMany({
      where: {
        AND: [
          { creatorId: session.user.id },
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
        subtasks: true,
        list: true,
      },
      orderBy: orderByClause,
      take: limit,
      skip: offset,
    });
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

export async function createTodo(data: CreateTodoParams) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      throw new Error("Unauthorized: No session found");
    }

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
        listId: data.listId,
        order: nextOrder,
        createdAt: new Date(),
        updatedAt: new Date(),
        creatorId: session.user.id,
      },
      include: {
        list: true,
        subtasks: true,
      },
    });

    return {
      ...todo,
      isCompleted: todo.completed,
    };
  } catch (error) {
    console.error("Error creating todo:", error);
    throw new Error("Failed to create todo");
  }
}

export async function updateTodo(id: string, data: UpdateTodoParams) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      throw new Error("Unauthorized: No session found");
    }
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
      listId?: string | null;
    } = {
      updatedAt: new Date(),
    };
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.isCompleted !== undefined) updateData.completed = data.isCompleted;
    if (data.isUrgent !== undefined) updateData.isUrgent = data.isUrgent;
    if (data.isImportant !== undefined)
      updateData.isImportant = data.isImportant;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.listId !== undefined) updateData.listId = data.listId;
    const todo = await db.task.update({
      where: {
        id,
        creatorId: session.user.id,
      },
      data: updateData,
      include: {
        list: true,
        subtasks: true,
      },
    });

    return {
      ...todo,
      isCompleted: todo.completed,
    };
  } catch (error) {
    console.error("Error updating todo:", error);
    throw new Error("Failed to update todo");
  }
}

export async function toggleTodoComplete(id: string) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      throw new Error("Unauthorized: No session found");
    }

    const currentTodo = await db.task.findUnique({
      where: {
        id,
        creatorId: session.user.id,
      },
    });

    if (!currentTodo) {
      throw new Error("Todo not found");
    }

    const todo = await db.task.update({
      where: {
        id,
        creatorId: session.user.id,
      },
      data: {
        completed: !currentTodo.completed,
        updatedAt: new Date(),
      },
    });

    return {
      ...todo,
      isCompleted: todo.completed,
    };
  } catch (error) {
    console.error("Error toggling todo completion:", error);
    throw new Error("Failed to toggle todo completion");
  }
}

export async function deleteTodo(id: string) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      throw new Error("Unauthorized: No session found");
    }

    await db.task.delete({
      where: {
        id,
        creatorId: session.user.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw new Error("Failed to delete todo");
  }
}
