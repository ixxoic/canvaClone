import z from "zod";
import NextAuth from "next-auth"
import bcrypt from "bcryptjs";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { JWT } from "next-auth/jwt";

import { db } from "@/db/drizzle";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

const CredentialSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

declare module "next-auth/jwt" {
  interface JWT {
    id: string | undefined;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        pasword: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        //接收凭证信息
        const validatedFields = CredentialSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        const query = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        const user = query[0];

        //如果没有用户或者用户没有密码，说明这个用户是通过Google或者Github登录创建的
        //也就无法进行凭据验证
        if (!user || !user.password) {
          return null;
          //不要让返回的信息太具体，？否则会被攻击
        }

        const passwordsMatch = await bcrypt.compare(
          password,
          user.password
        );

        if (!passwordsMatch) {
          return null;
        }

        return user;
      }
    }),
    GitHub,
    Google
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in"
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
      }

      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    }
  }
})

