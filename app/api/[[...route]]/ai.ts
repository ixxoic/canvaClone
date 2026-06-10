import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import llmConfig from "@/config/llmConfig";
import { verifyAuth } from "@hono/auth-js";

type ImageGenerationResponse = {
  data?: Array<{
    url?: string;
    b64_json?: string;
  }>;
};

const getImageUrl = (result: ImageGenerationResponse) => {
  const image = result.data?.[0];

  return image?.url ?? (image?.b64_json ? `data:image/png;base64,${image.b64_json}` : null);
};

const getImageBlob = async (image: string, origin: string) => {
  const imageUrl = image.startsWith("data:")
    ? image
    : new URL(image, origin).toString();

  const response = await fetch(imageUrl);

  if (!response.ok) {
    return {
      blob: null,
      error: {
        status: response.status,
        statusText: response.statusText,
      },
    };
  }

  return {
    blob: await response.blob(),
    error: null,
  };
};

const app = new Hono()
  .post(
    "/remove-bg",
    verifyAuth(),
    zValidator(
      "json",
      z.object({
        image: z.string(),
      }),
    ),
    async (c) => {
      const { image } = c.req.valid("json");
      const origin = new URL(c.req.url).origin;

      try {
        const { blob, error } = await getImageBlob(image, origin);

        if (!blob) {
          return c.json(
            {
              error: "图片下载失败",
              ...error,
            },
            500,
          );
        }

        const formData = new FormData();

        formData.append("model", "gpt-image-2");
        formData.append("prompt", "remove the background, keep the main subject, transparent background");
        formData.append("image", blob, "image.png");
        formData.append("n", "1");
        formData.append("size", "1024x1024");

        const response = await fetch(`${llmConfig.baseURL}/images/edits`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${llmConfig.apiKey}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();

          return c.json(
            {
              error: "背景移除失败",
              status: response.status,
              statusText: response.statusText,
              detail: errorText || "上游接口没有返回错误详情",
            },
            500,
          );
        }

        const result = await response.json<ImageGenerationResponse>();
        const imageUrl = getImageUrl(result);

        if (!imageUrl) {
          return c.json({ error: "背景移除失败", detail: result }, 500);
        }

        return c.json({ url: imageUrl });
      } catch (error) {
        return c.json(
          {
            error: "背景移除失败",
            detail: error instanceof Error ? error.message : "未知错误",
          },
          500,
        );
      }
    },
  )
  .post(
    "/generate-image",
    verifyAuth(),
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
      const imageUrl = getImageUrl(result);

      if (!imageUrl) {
        return c.json({ error: "图片生成失败", detail: result }, 500);
      }

      return c.json({ url: imageUrl });
    }
  )

export default app;
