import { service } from "@/lib/authClient";
import { albumKey } from "@/utils/react-query-key";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { AlbumEntity, AlbumPayload } from "../model";

type AlbumListResponse = { data: AlbumEntity[] } | AlbumEntity[];

export const useGetAlbums = () => {
  return useQuery<AlbumListResponse>({
    queryKey: [albumKey],
    queryFn: async () => {
      const res = await service.get(`/albums`);
      return res.data;
    },
  });
};

export const useCreateAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AlbumPayload) => {
      const res = await service.post(`/albums`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [albumKey] });
    },
  });
};

export type UpdateAlbumArgs = {
  id: string;
  payload: AlbumPayload;
};

export const useUpdateAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateAlbumArgs) => {
      const res = await service.post(`/albums/update/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [albumKey] });
    },
  });
};

export type DeleteAlbumArgs = {
  id: string;
};

export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteAlbumArgs) => {
      const res = await service.post(`/albums/delete/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [albumKey] });
    },
  });
};
