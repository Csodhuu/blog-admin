import { service } from "@/lib/authClient";
import { aboutKey } from "@/utils/react-query-key";
import { useQuery } from "@tanstack/react-query";

export const useGetAbout = () => {
  return useQuery({
    queryKey: [aboutKey],
    queryFn: async () => {
      const res = await service.get(`/about`);
      return res.data;
    },
  });
};
