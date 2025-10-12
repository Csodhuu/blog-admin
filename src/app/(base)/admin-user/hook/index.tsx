import { service } from "@/lib/authClient";
import { adminUserKey } from "@/utils/react-query-key";
import { useQuery } from "@tanstack/react-query";

export const useGetAdminUser = () => {
  return useQuery({
    queryKey: [adminUserKey],
    queryFn: async () => {
      const res = await service.get(`/admin`);
      return res.data;
    },
  });
};
