// routes/tasks.ts
import { Hono } from "hono";
import { prisma } from "../lib/prisma";
import { auth } from "@/lib/auth";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "@/controllers/tasks.controller";
import { createSubtaskSchema } from "@/validations/task.validation";

const taskRouter = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

taskRouter.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return c.json(
      {
        message: "Unauthorized",
      },
      401
    );
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

taskRouter.get("/", getTasks);
taskRouter.post("/", createTask);
taskRouter.get("/:id", getTask);
taskRouter.put("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);

taskRouter.get("/:id/subtasks", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  const id = c.req.param("id");
  try {
    const data = await prisma.subtask.findMany({
      where: { parentId: id, parent: { creatorId: session?.user.id } },
    });

    return c.json(data);
  } catch (e) {
    console.log(e);

    return c.json({ error: "Task no found" }, 404);
  }
});

taskRouter.post("/subtasks", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  const body = await c.req.json();
  const parse = createSubtaskSchema.safeParse(body);
  if (!parse.success) {
    return c.json({ error: parse.error.format() }, 400);
  }
  const existParent = await prisma.task.findFirst({
    where: { id: parse.data.parentId, creatorId: session?.user.id },
  });

  if (!existParent) {
    return c.json(
      {
        message: "Not found",
      },
      404
    );
  }
  try {
    const subtask = await prisma.subtask.create({
      data: {
        parent: {
          connect: {
            id: parse.data.parentId,
          },
        },
        title: parse.data.title,
        completed: parse.data.completed,
      },
    });
    return c.json(subtask);
  } catch {
    return c.json({ error: "Task not found" }, 404);
  }
});

taskRouter.put("/subtasks/:id", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  const id = c.req.param("id");
  const exist = await prisma.subtask.findFirst({
    where: {
      AND: [
        { id },
        {
          parent: {
            creatorId: session?.user.id,
          },
        },
      ],
    },
  });
  if (!exist) {
    return c.json({ error: "Not found" }, 404);
  }
  const body = await c.req.json();
  const parse = createSubtaskSchema.safeParse({
    ...exist,
    ...body,
  });

  if (!parse.success) {
    console.log(parse.error);

    return c.json({ error: parse.error.format() }, 400);
  }
  const subtask = await prisma.subtask.update({
    where: { id },
    data: {
      ...exist,
      ...parse.data,
    },
  });

  return c.json(subtask);
});

export default taskRouter;
