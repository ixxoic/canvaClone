import { toast } from "sonner";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.projects[":id"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.projects[":id"]["$patch"]>["json"];

export const useUpdateProject = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationKey: ["project", { id }],
    mutationFn: async (json) => {
      const response = await client.api.projects[":id"].$patch({
        json,
        param: { id }
      });

      if (!response.ok) {
        throw new Error("更新项目失败")
      }

      return await response.json();
    },
    onSuccess: () => {
      //TODO: Invalidate "projects" query
      queryClient.invalidateQueries({ queryKey: ["project", { id }] })
    },
    onError: () => {
      toast.error("更新项目失败")
    }
  });

  return mutation;
}