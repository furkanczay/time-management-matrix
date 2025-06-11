import { prisma as db } from "../prisma";
// TODO: Implement session handling for Hono
// import { getSession } from "../session";

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
  userId: string;
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
  userId: string;
  title: string;
  description?: string | null;
  isUrgent: boolean;
  isImportant: boolean;
  isCompleted?: boolean;
  dueDate?: Date | null;
  listId?: string | null;
}

interface UpdateTodoParams {
  userId: string;
  title?: string;
  description?: string | null;
  isUrgent?: boolean;
  isImportant?: boolean;
  isCompleted?: boolean;
  dueDate?: Date | null;
  order?: number;
  listId?: string | null;
}

// GET - Fetch todos
export async function getTodos(params: GetTodosParams) {
  const {
    userId,
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
    // TODO: Add user authentication when implementing session
    // const session = await getSession();
    // if (!session || !session.user) {
    //   throw new Error("Unauthorized: No session found");
    // }

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
          { creatorId: userId }, // Only fetch user's own todos
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
        list: true, // Include list information
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
    const { userId, ...todoData } = data;

    const existingTodos = await db.task.findMany({
      where: {
        creatorId: userId,
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
        creatorId: userId,
      },
      include: {
        list: true,
        subtasks: true,
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
    // TODO: Add user authentication
    // const session = await getSession();
    // if (!session || !session.user) {
    //   throw new Error("Unauthorized: No session found");
    // }
    const { userId, ...updateFields } = data; // Prepare update data
    const updateData: {
      updatedAt: Date;
      title?: string;
      description?: string | null;
      completed?: boolean;
      isUrgent?: boolean;
      isImportant?: boolean;
      dueDate?: Date | null;
      category?: string;
      order?: number;
      listId?: string | null;
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
    if (data.listId !== undefined) updateData.listId = data.listId;
    const todo = await db.task.update({
      where: {
        id,
        creatorId: userId, // Only update user's own todos
      },
      data: updateData,
      include: {
        list: true,
        subtasks: true,
      },
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
export async function toggleTodoComplete(id: string, userId: string) {
  try {
    const currentTodo = await db.task.findUnique({
      where: {
        id,
        creatorId: userId, // Only access user's own todos
      },
    });

    if (!currentTodo) {
      throw new Error("Todo not found");
    }

    const todo = await db.task.update({
      where: {
        id,
        creatorId: userId, // Only update user's own todos
      },
      data: {
        completed: !currentTodo.completed,
        updatedAt: new Date(),
      },
      include: {
        list: true,
        subtasks: true,
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
export async function deleteTodo(id: string, userId: string) {
  try {
    await db.task.delete({
      where: {
        id,
        creatorId: userId, // Only delete user's own todos
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw new Error("Failed to delete todo");
  }
}

// GET - Fetch ordered todos (for drag and drop)
export async function getOrderedTodos(userId: string) {
  try {
    const todos = await db.task.findMany({
      where: {
        creatorId: userId,
      },
      include: {
        subtasks: true,
        list: true,
      },
      orderBy: [{ completed: "asc" }, { order: "asc" }, { createdAt: "desc" }],
    });

    // Add isCompleted field to each todo and its subtasks
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
    console.error("Error fetching ordered todos:", error);
    throw new Error("Failed to fetch ordered todos");
  }
}
