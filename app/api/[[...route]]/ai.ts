import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { FileOutput } from "replicate";

import { replicate } from "@/lib/replicate";

const getImageUrl = (output: unknown) => {
  const image = Array.isArray(output) ? output[0] : output;

  if (typeof image === "string") {
    return image;
  }

  if (image && typeof image === "object" && "url" in image) {
    const { url } = image as FileOutput | { url: string };

    if (typeof url === "string") {
      return url;
    }

    return url().toString();
  }

  return null;
};

const app = new Hono()
  .post(
    "/generate-image",
    zValidator(
      "json",
      z.object({
        prompt: z.string(),
      }),
    ),
    async (c) => {
      const { prompt } = c.req.valid("json");

      const input = {
        cfg: 4.5,
        prompt,
        aspect_ratio: "1:1",
        output_format: "webp",
        prompt_strength: 0.85,
      };

      const output = await replicate.run("stability-ai/stable-diffusion-3.5-large", { input });
      const imageUrl = getImageUrl(output);

      if (!imageUrl) {
        return c.json({ error: "图片生成失败" }, 500);
      }

      return c.json({ url: imageUrl });
    }
  )

export default app;
