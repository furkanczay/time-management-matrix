import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createSubtaskSchema,
  createTaskSchema,
} from "@/validations/task.validation";
import { Context } from "hono";

export const getTasks = async (c: Context) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  const tasks = await prisma.task.findMany({
    include: { subtasks: true },
    where: { creatorId: session?.user.id },
    orderBy: {
      createdAt: "desc",
    },
  });
  return c.json(tasks);
};

export const createTask = async (c: Context) => {
  const body = await c.req.json();
  const parse = createTaskSchema.safeParse(body);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!parse.success) {
    return c.json({ error: parse.error.format() }, 400);
  }

  const { title, description, quadrant, completed, id } = parse.data;

  const task = await prisma.task.create({
    data: {
      id: id ?? undefined,
      title,
      description,
      quadrant,
      completed: completed ?? false,
      creator: {
        connect: {
          id: session?.user.id,
        },
      },
    },
  });

  return c.json(task);
};

export const getTask = async (c: Context) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  const id = c.req.param("id");
  const task = await prisma.task.findFirst({
    where: {
      AND: [{ id }, { creatorId: session?.user.id }],
    },
    include: {
      subtasks: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!task) return c.json({ error: "Task not found" }, 404);
  return c.json(task);
};

export const updateTask = async (c: Context) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  const id = c.req.param("id");
  const exist = await prisma.task.findFirst({
    where: {
      AND: [{ id }, { creatorId: session?.user.id }],
    },
  });
  if (!exist) {
    return c.json({ error: "Not found" }, 404);
  }
  const body = await c.req.json();
  const parse = createTaskSchema.safeParse({
    ...exist,
    ...body,
  });

  if (!parse.success) {
    console.log(parse.error);

    return c.json({ error: parse.error.format() }, 400);
  }

  const task = await prisma.task.update({
    where: { id, creatorId: session?.user.id },
    data: {
      ...exist,
      ...parse.data,
    },
  });

  return c.json(task);
};

export const deleteTask = async (c: Context) => {
  const id = c.req.param("id");
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  console.log(id);

  try {
    await prisma.task.delete({
      where: {
        id,
        creatorId: session?.user.id,
      },
    });
    return c.json({ success: true });
  } catch (e) {
    console.log(e);

    return c.json({ error: "Task not found" }, 404);
  }
};

export const getSubtasks = async (c: Context) => {
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
};

export const createSubtask = async (c: Context) => {
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
};

export const updateSubtask = async (c: Context) => {
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
};
