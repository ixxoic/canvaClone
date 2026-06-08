import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import llmConfig from "@/config/llmConfig";

type ImageGenerationResponse = {
  data?: Array<{
    url?: string;
    b64_json?: string;
  }>;
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

      const response = await fetch(`${llmConfig.baseURL}/images/generations`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${llmConfig.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-image-2",
          prompt,
          n: 1,
          size: "1024x1024",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();

        return c.json(
          {
            error: "图片生成失败",
            status: response.status,
            statusText: response.statusText,
            detail: errorText || "上游接口没有返回错误详情",
          },
          500,
        );
      }

      const result = await response.json<ImageGenerationResponse>();
      const image = result.data?.[0];
      const imageUrl = image?.url ?? (image?.b64_json ? `data:image/png;base64,${image.b64_json}` : null);

      if (!imageUrl) {
        return c.json({ error: "图片生成失败", detail: result }, 500);
      }

      return c.json({ url: imageUrl });
    }
  )

export default app;
