import { Hono } from "hono";

import { unsplash } from "@/features/editor/lib/unsplash";

//需要加载多少张图片
const DEFAULT_COUNT = 50;
//找到你觉得合适的相册ID
const DEFAULT_COLLECTION_IDS = ["317099"];

const app = new Hono()
  .get("/", async (c) => {

    const images = await unsplash.photos.getRandom({
      collectionIds: DEFAULT_COLLECTION_IDS,
      count: DEFAULT_COUNT,
    });

    if (images.errors) {
      return c.json({ error: "Something went wrong" }, 400);
    }

    let response = images.response;

    if (!Array.isArray(response)) {
      response = [response];
    }

    return c.json({ data: response });
  });

export default app;