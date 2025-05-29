import { auth } from "@/lib/auth";
import { Context, Next } from "hono";

export const authMiddleware = async (c: Context, next: Next) => {
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
};
