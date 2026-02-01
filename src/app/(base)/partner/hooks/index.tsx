import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { service } from "@/lib/authClient";
import { partnerKey } from "@/utils/react-query-key";

import type { PartnerEntity, PartnerPayload } from "../model";

export type PartnerListResponse = { data: PartnerEntity[] } | PartnerEntity[];

export const useGetPartners = () => {
  return useQuery<PartnerListResponse>({
    queryKey: [partnerKey],
    queryFn: async () => {
      const res = await service.get(`/partner`);
      return res.data;
    },
  });
};

export const useCreatePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PartnerPayload) => {
      const res = await service.post(`/partner`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [partnerKey] });
    },
  });
};

export type UpdatePartnerArgs = {
  id: string;
  payload: PartnerPayload;
};

export const useUpdatePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: UpdatePartnerArgs) => {
      const res = await service.put(`/partner/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [partnerKey] });
    },
  });
};

export type DeletePartnerArgs = {
  id: string;
};

export const useDeletePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeletePartnerArgs) => {
      const res = await service.delete(`/partner/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [partnerKey] });
    },
  });
};
