import { service } from "@/lib/authClient";
import { campKey } from "@/utils/react-query-key";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CampEntity, CampPayload } from "../model";

type CampListResponse = { data: CampEntity[] } | CampEntity[];

export const useGetCamps = () => {
  return useQuery<CampListResponse>({
    queryKey: [campKey],
    queryFn: async () => {
      const res = await service.get(`/camps`);
      return res.data;
    },
  });
};

export const useCreateCamp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CampPayload) => {
      const res = await service.post(`/camps`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [campKey] });
    },
  });
};

export type UpdateCampArgs = {
  id: string;
  payload: CampPayload;
};

export const useUpdateCamp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateCampArgs) => {
      const res = await service.put(`/camps/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [campKey] });
    },
  });
};

export type DeleteCampArgs = {
  id: string;
};

export const useDeleteCamp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteCampArgs) => {
      const res = await service.delete(`/camps/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [campKey] });
    },
  });
};
