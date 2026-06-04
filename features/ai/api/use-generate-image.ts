import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

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
      return await response.json();
    },
  });

  return mutation;
}