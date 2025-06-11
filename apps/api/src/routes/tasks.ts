import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  getOrderedTodos,
  toggleTodoComplete,
} from "../lib/api/todos";
import { requireAuth } from "../lib/session";
import { Variables } from "../types";

const app = new Hono<{ Variables: Variables }>();

// Apply auth middleware to all routes
app.use("*", requireAuth);

// Validation schemas
const createTodoSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  isUrgent: z.boolean(),
  isImportant: z.boolean(),
  isCompleted: z.boolean().optional().default(false),
  dueDate: z.string().nullable().optional(),
  listId: z.string().nullable().optional(),
});

const updateTodoSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  isUrgent: z.boolean().optional(),
  isImportant: z.boolean().optional(),
  isCompleted: z.boolean().optional(),
  dueDate: z.string().nullable().optional(),
  listId: z.string().nullable().optional(),
  order: z.number().optional(),
});

const querySchema = z.object({
  search: z.string().optional(),
  quadrant: z.string().optional(),
  isCompleted: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
  sortBy: z.enum(["order", "dueDate", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  filterToday: z
    .string()
    .transform((val) => val === "true")
    .optional(),
});

// GET /api/tasks
app.get("/", zValidator("query", querySchema), async (c) => {
  try {
    const params = c.req.valid("query");
    const user = c.get("user");

    const todos = await getTodos({
      userId: user.id,
      search: params.search,
      quadrant: params.quadrant,
      isCompleted: params.isCompleted,
      limit: params.limit || 50,
      offset: params.offset || 0,
      sortBy: params.sortBy || "order",
      sortOrder: params.sortOrder || "asc",
      filterToday: params.filterToday,
    });

    return c.json({
      success: true,
      data: todos,
      count: todos.length,
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// POST /api/tasks
app.post("/", zValidator("json", createTodoSchema), async (c) => {
  try {
    const body = c.req.valid("json");
    const user = c.get("user");

    const todo = await createTodo({
      title: body.title,
      description: body.description,
      isUrgent: body.isUrgent,
      isImportant: body.isImportant,
      isCompleted: body.isCompleted,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      listId: body.listId || null,
      userId: user.id,
    });

    return c.json(
      {
        success: true,
        data: todo,
      },
      201
    );
  } catch (error) {
    console.error("Error creating todo:", error);
    return c.json({ success: false, error: "Failed to create todo" }, 500);
  }
});

// PUT /api/tasks/:id
app.put("/:id", zValidator("json", updateTodoSchema), async (c) => {
  try {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const user = c.get("user");
    const todo = await updateTodo(id, {
      title: body.title,
      description: body.description,
      isUrgent: body.isUrgent,
      isImportant: body.isImportant,
      isCompleted: body.isCompleted,
      order: body.order,
      listId: body.listId,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      userId: user.id,
    });

    return c.json({
      success: true,
      data: todo,
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    return c.json({ success: false, error: "Failed to update todo" }, 500);
  }
});

// DELETE /api/tasks/:id
app.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const user = c.get("user");

    await deleteTodo(id, user.id);

    return c.json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return c.json({ success: false, error: "Failed to delete todo" }, 500);
  }
});

// PATCH /api/tasks/:id - Toggle completion status
app.patch("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const user = c.get("user");

    const todo = await toggleTodoComplete(id, user.id);

    return c.json({
      success: true,
      data: todo,
    });
  } catch (error) {
    console.error("Error toggling todo completion:", error);
    return c.json(
      { success: false, error: "Failed to toggle todo completion" },
      500
    );
  }
});

// GET /api/tasks/ordered
app.get("/ordered", async (c) => {
  try {
    const user = c.get("user");
    const todos = await getOrderedTodos(user.id);

    return c.json({
      success: true,
      data: todos,
    });
  } catch (error) {
    console.error("Error fetching ordered todos:", error);
    return c.json(
      { success: false, error: "Failed to fetch ordered todos" },
      500
    );
  }
});

export default app;
