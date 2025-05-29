import { Hono } from "hono";
import { auth } from "@/lib/auth";
import {
  createSubtask,
  createTask,
  deleteTask,
  getSubtasks,
  getTask,
  getTasks,
  updateSubtask,
  updateTask,
} from "@/controllers/tasks.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const taskRouter = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

taskRouter.use("*", authMiddleware);
taskRouter.get("/", getTasks);
taskRouter.post("/", createTask);
taskRouter.get("/:id", getTask);
taskRouter.put("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);
taskRouter.get("/:id/subtasks", getSubtasks);
taskRouter.post("/subtasks", createSubtask);
taskRouter.put("/subtasks/:id", updateSubtask);

export default taskRouter;
