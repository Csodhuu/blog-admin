import { service } from "@/lib/authClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SuperAdminForm } from "../model";

export const useCreateSuperAdmin = ({
  onSuccess,
}: {
  onSuccess: (data: SuperAdminForm) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: SuperAdminForm) => {
      const res = await service.post(`/admin`, input);
      const data = res.data;
      onSuccess(data);
      return data;
    },
    onSuccess: () => {},
  });
};
