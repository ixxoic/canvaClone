import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.ai["generate-image"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.ai["generate-image"]["$post"]>["json"];

export const useGenerateImage = () => {
  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (data) => {
      const response = await client.api.ai["generate-image"].$post({ json: data });

      if (!response.ok) {
        const error = await response.json();
        throw new Error("detail" in error ? String(error.detail) : "图片生成失败");
      }

      return await response.json();
    },
    onError: (error) => {
      toast.error(error.message || "图片生成失败");
    },
  });

  return mutation;
}
