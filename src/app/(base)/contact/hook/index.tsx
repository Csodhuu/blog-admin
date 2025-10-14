import { service } from "@/lib/authClient";
import { contactKey } from "@/utils/react-query-key";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type ContactSocialLink = {
  label: string;
  href: string;
};

export type ContactPayload = {
  address: string;
  phone: string;
  email: string;
  socialLinks: ContactSocialLink[];
  mapPhoto: string;
};

export type ContactEntity = ContactPayload & {
  _id?: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ContactListResponse =
  | ContactEntity[]
  | ContactEntity
  | { data: ContactEntity[] }
  | { data: ContactEntity };

export const useGetContacts = () => {
  return useQuery<ContactListResponse>({
    queryKey: [contactKey],
    queryFn: async () => {
      const res = await service.get(`/contact`);
      return res.data;
    },
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ContactPayload) => {
      const res = await service.post(`/contact`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [contactKey] });
    },
  });
};

export type UpdateContactArgs = {
  id: string;
  payload: ContactPayload;
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateContactArgs) => {
      const res = await service.put(`/contact/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [contactKey] });
    },
  });
};

export type DeleteContactArgs = {
  id: string;
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteContactArgs) => {
      const res = await service.delete(`/contact/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [contactKey] });
    },
  });
};
