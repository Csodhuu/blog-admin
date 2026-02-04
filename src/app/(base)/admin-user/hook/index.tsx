import { service } from "@/lib/authClient";
import { adminUserKey } from "@/utils/react-query-key";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  AdminUserEntity,
  CreateAdminUserPayload,
  UpdateAdminUserPayload,
} from "../model";

export type AdminUserListResponse =
  | { data: AdminUserEntity[] }
  | AdminUserEntity[];

export const useGetAdminUsers = () => {
  return useQuery<AdminUserListResponse>({
    queryKey: [adminUserKey],
    queryFn: async () => {
      const res = await service.get(`/admin`);
      return res.data;
    },
  });
};

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAdminUserPayload) => {
      const res = await service.post(`/admin`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [adminUserKey] });
    },
  });
};

export type UpdateAdminUserArgs = {
  id: string;
  payload: UpdateAdminUserPayload;
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateAdminUserArgs) => {
      const res = await service.post(`/admin/update/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [adminUserKey] });
    },
  });
};

export type DeleteAdminUserArgs = {
  id: string;
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteAdminUserArgs) => {
      const res = await service.post(`/admin/delete/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [adminUserKey] });
    },
  });
};
