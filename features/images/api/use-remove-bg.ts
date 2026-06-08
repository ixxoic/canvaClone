import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.ai["remove-bg"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.ai["remove-bg"]["$post"]>["json"];

export const useRemoveBg = () => {
  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (data) => {
      const response = await client.api.ai["remove-bg"].$post({ json: data });
      return await response.json();
    },
  });

  return mutation;
}
