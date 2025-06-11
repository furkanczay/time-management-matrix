import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createList, getLists, updateList, deleteList } from "../lib/api/lists";
import { requireAuth } from "../lib/session";
import { Variables } from "../types";

const app = new Hono<{ Variables: Variables }>();

// Apply auth middleware to all routes
app.use("*", requireAuth);

// Validation schemas
const createListSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  color: z.string().optional(),
});

const updateListSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  color: z.string().optional(),
});

// GET /api/lists
app.get("/", async (c) => {
  try {
    const user = c.get("user");
    const lists = await getLists(user.id);
    return c.json({
      success: true,
      data: lists,
    });
  } catch (error) {
    console.error("Error fetching lists:", error);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// POST /api/lists
app.post("/", zValidator("json", createListSchema), async (c) => {
  try {
    const body = c.req.valid("json");
    const user = c.get("user");

    const list = await createList({
      ...body,
      userId: user.id,
    });

    return c.json(
      {
        success: true,
        data: list,
      },
      201
    );
  } catch (error) {
    console.error("Error creating list:", error);
    return c.json({ success: false, error: "Failed to create list" }, 500);
  }
});

// PUT /api/lists/:id
app.put("/:id", zValidator("json", updateListSchema), async (c) => {
  try {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const user = c.get("user");

    const list = await updateList(id, {
      ...body,
      userId: user.id,
    });

    return c.json({
      success: true,
      data: list,
    });
  } catch (error) {
    console.error("Error updating list:", error);
    return c.json({ success: false, error: "Failed to update list" }, 500);
  }
});

// DELETE /api/lists/:id
app.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const user = c.get("user");
    await deleteList(id, user.id);

    return c.json({
      success: true,
      message: "List deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting list:", error);
    return c.json({ success: false, error: "Failed to delete list" }, 500);
  }
});

export default app;
