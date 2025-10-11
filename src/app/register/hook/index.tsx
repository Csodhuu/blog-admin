import { service } from "@/lib/authClient";
import { useMutation } from "@tanstack/react-query";

import type { SuperAdminForm } from "../model";

interface UseCreateSuperAdminOptions {
  onSuccess?: (data: SuperAdminForm) => void;
  onError?: (error: Error) => void;
}

export const useCreateSuperAdmin = (
  options: UseCreateSuperAdminOptions = {}
) => {
  return useMutation<SuperAdminForm, Error, SuperAdminForm>({
    mutationFn: async (input: SuperAdminForm) => {
      const res = await service.post(`/admin`, input);
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
