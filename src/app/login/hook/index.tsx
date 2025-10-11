import { service } from "@/lib/authClient";
import { useMutation } from "@tanstack/react-query";

import type { LoginForm } from "../model";

export const useLogin = (
  options: {
    onSuccess?: (data: LoginForm) => void;
    onError?: (error: Error) => void;
  } = {}
) => {
  return useMutation<LoginForm, Error, LoginForm>({
    mutationFn: async (input: LoginForm) => {
      const res = await service.post(`/admin/login`, input);
      return res.data;
    },
    onSuccess: (data) => {
      options.onSuccess?.(data);
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
};
