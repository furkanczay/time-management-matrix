import { Hono } from "hono";
import { auth } from "@/lib/auth";
import { cors } from "hono/cors";
import taskRouter from "./routes/tasks.route";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.get("/session", (c) => {
  const session = c.get("session");
  const user = c.get("user");

  if (!user)
    return c.json(
      {
        message: "Unauthorized",
      },
      401
    );

  return c.json({
    session,
    user,
  });
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/tasks", taskRouter);

export default app;
