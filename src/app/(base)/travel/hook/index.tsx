import { service } from "@/lib/authClient";
import { travelKey } from "@/utils/react-query-key";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { TravelEntity, TravelPayload } from "../model";

export type TravelListResponse = { data: TravelEntity[] } | TravelEntity[];

export const useGetTravels = () => {
  return useQuery<TravelListResponse>({
    queryKey: [travelKey],
    queryFn: async () => {
      const res = await service.get(`/travels`);
      return res.data;
    },
  });
};

export const useCreateTravel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TravelPayload) => {
      const res = await service.post(`/travels`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [travelKey] });
    },
  });
};

export type UpdateTravelArgs = {
  id: string;
  payload: TravelPayload;
};

export const useUpdateTravel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateTravelArgs) => {
      const res = await service.put(`/travels/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [travelKey] });
    },
  });
};

export type DeleteTravelArgs = {
  id: string;
};

export const useDeleteTravel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteTravelArgs) => {
      const res = await service.delete(`/travels/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [travelKey] });
    },
  });
};
