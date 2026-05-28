import { Hono } from "hono";
import { handle } from "hono/vercel";

import images from "./images";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

const routes = app
  .route("/images", images)

//用hono的handle函数将app处理成一个可以在vercel上运行的函数，并导出GET方法，使其成为一个API路由。
export const GET = handle(app);

export type AppType = typeof routes;