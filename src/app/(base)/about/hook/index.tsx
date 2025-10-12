import { service } from "@/lib/authClient";
import { aboutKey } from "@/utils/react-query-key";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type AboutTimelineItem = {
  year: string;
  milestone: string;
};

export type AboutCapability = {
  title: string;
  description: string;
};

export type AboutPayload = {
  paragraphImage: string;
  title: string;
  content: string;
  timeline: AboutTimelineItem[];
  achievements: string[];
  paragraphs: string[];
  capabilities: AboutCapability[];
};

export type AboutEntity = AboutPayload & {
  _id?: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

type AboutListResponse = { data: AboutEntity[] } | AboutEntity[];

export const useGetAbout = () => {
  return useQuery<AboutListResponse>({
    queryKey: [aboutKey],
    queryFn: async () => {
      const res = await service.get(`/about`);
      return res.data;
    },
  });
};

export const useCreateAbout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AboutPayload) => {
      const res = await service.post(`/about`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [aboutKey] });
    },
  });
};

export type UpdateAboutArgs = {
  id: string;
  payload: AboutPayload;
};

export const useUpdateAbout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateAboutArgs) => {
      const res = await service.put(`/about/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [aboutKey] });
    },
  });
};

export type DeleteAboutArgs = {
  id: string;
};

export const useDeleteAbout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteAboutArgs) => {
      const res = await service.delete(`/about/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [aboutKey] });
    },
  });
};
