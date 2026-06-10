import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.users["$post"]>;
type RequestType = InferRequestType<typeof client.api.users["$post"]>["json"];

const getErrorCode = (body: unknown) => {
  if (
    body &&
    typeof body === "object" &&
    "error" in body &&
    typeof body.error === "string"
  ) {
    return body.error;
  }
};

export class SignUpError extends Error {
  status: number;
  code?: string;

  constructor(status: number, code?: string) {
    super(code ?? "SIGN_UP_FAILED");
    this.name = "SignUpError";
    this.status = status;
    this.code = code;
  }
}

export const useSignUp = () => {
  const mutation = useMutation<
    ResponseType,
    SignUpError,
    RequestType
  >({
    mutationFn: async (data) => {
      const response = await client.api.users.$post({ json: data });

      if (!response.ok) {
        const body = await response.json().catch(() => null);

        throw new SignUpError(
          response.status,
          getErrorCode(body)
        );
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("用户已创建");
    }
  });

  return mutation;
}
