import { service } from "@/lib/authClient";
import { competitionKey } from "@/utils/react-query-key";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CompetitionEntity, CompetitionPayload } from "../model";

export type CompetitionListResponse =
  | { data: CompetitionEntity[] }
  | CompetitionEntity[];

export const useGetCompetitions = () => {
  return useQuery<CompetitionListResponse>({
    queryKey: [competitionKey],
    queryFn: async () => {
      const res = await service.get(`/competitions`);
      return res.data;
    },
  });
};

export const useCreateCompetition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CompetitionPayload) => {
      const res = await service.post(`/competitions`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [competitionKey] });
    },
  });
};

export type UpdateCompetitionArgs = {
  id: string;
  payload: CompetitionPayload;
};

export const useUpdateCompetition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateCompetitionArgs) => {
      const res = await service.post(`/competitions/update/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [competitionKey] });
    },
  });
};

export type DeleteCompetitionArgs = {
  id: string;
};

export const useDeleteCompetition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteCompetitionArgs) => {
      const res = await service.post(`/competitions/delete/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [competitionKey] });
    },
  });
};
