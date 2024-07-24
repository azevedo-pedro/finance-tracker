import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

const app = new Hono().basePath("/api");

app.use("*", clerkMiddleware());
app
  .get("/hello", (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({
        error: "Unauthorized",
      });
    }
    return c.json({
      message: "Hello Next.js!",
      userId: auth.userId,
    });
  })
  .get(
    "/hello/:test",
    zValidator(
      "param",
      z.object({
        test: z.string(),
      }),
    ),
    (c) => {
      const auth = getAuth(c);
      const { test } = c.req.valid("param");

      if (!auth?.userId) {
        return c.json({
          error: "Unauthorized",
        });
      }
      return c.json({
        message: "Hello Next.js!",
        test: test,
      });
    },
  );

export const GET = handle(app);
export const POST = handle(app);
