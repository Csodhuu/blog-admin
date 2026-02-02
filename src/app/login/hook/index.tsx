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
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });

        const data = (await res.json().catch(() => ({}))) as LoginResponse & {
          message?: string;
        };

        if (!res.ok) {
          throw new Error(
            data?.message || "Нэвтрэх явцад алдаа гарлаа."
          );
        }

        return data;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

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
