import { z } from "zod";
import bcrypt from "bcryptjs"
import { Hono } from "hono";
import { sql } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

const app = new Hono()
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6).max(20),
      })
    ),
    async (c) => {
      const { name, email, password } = c.req.valid("json");

      const [existingUser] = await db
        .select({ id: users.id })
        .from(users)
        .where(sql`${users.email} = ${email}`)
        .limit(1);

      if (existingUser) {
        return c.json({ error: "邮箱已被使用" }, 409);
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      await db.insert(users).values({
        email,
        name,
        password: hashedPassword,
      });

      return c.json(null, 200);
    }
  );

export default app;
