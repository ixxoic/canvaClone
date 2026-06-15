import { toast } from "sonner";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.projects["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.projects["$post"]>["json"];

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (data) => {
      const response = await client.api.projects.$post({ json: data });

      if (!response.ok) {
        throw new Error("出错了")
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("项目创建成功");

      //TODO: Invalidate "projects" query
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error("项目创建失败")
    }
  });

  return mutation;
}