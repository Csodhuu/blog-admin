import { service } from "@/lib/authClient";
import type { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import type { LoginForm, LoginResponse } from "../model";

interface UseLoginOptions {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: Error) => void;
}

export const useLogin = (options: UseLoginOptions = {}) => {
  return useMutation<LoginResponse, Error, LoginForm>({
    mutationFn: async (input: LoginForm) => {
      try {
        const res = await service.post<LoginResponse>(`/admin/login`, input);
        return res.data;
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const message =
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Нэвтрэх явцад алдаа гарлаа.";

        throw new Error(message);
      }
    },
    onSuccess: (data) => {
      options.onSuccess?.(data);
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
};
