"use client";

import { useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

import ButtonWithAdornment from "@/components/form-elements/button-with-adornment";

import AdminUserDialog from "./components/admin-user-dialog";
import AdminUserList from "./components/admin-user-list";
import {
  useCreateAdminUser,
  useDeleteAdminUser,
  useGetAdminUsers,
  useUpdateAdminUser,
} from "./hook";
import type {
  AdminUserEntity,
  AdminUserFormValues,
  CreateAdminUserPayload,
  UpdateAdminUserPayload,
} from "./model";

const normalizeAdminUsers = (payload: unknown): AdminUserEntity[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload as AdminUserEntity[];
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: AdminUserEntity[] }).data;
  }

  return [];
};

const extractId = (user: AdminUserEntity | null) => user?._id ?? user?.id ?? "";

const sanitizeCreatePayload = (
  values: AdminUserFormValues
): CreateAdminUserPayload => ({
  username: values.username.trim(),
  email: values.email.trim().toLowerCase(),
  password: values.password.trim(),
  iSuperAdmin: Boolean(values.iSuperAdmin),
});

const sanitizeUpdatePayload = (
  values: AdminUserFormValues
): UpdateAdminUserPayload => {
  const payload: UpdateAdminUserPayload = {
    username: values.username.trim(),
    email: values.email.trim().toLowerCase(),
    iSuperAdmin: Boolean(values.iSuperAdmin),
  };

  const trimmedPassword = values.password.trim();
  if (trimmedPassword) {
    payload.password = trimmedPassword;
  }

  return payload;
};

const getErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return (
    axiosError?.response?.data?.message ||
    axiosError?.message ||
    "Алдаа гарлаа."
  );
};

export default function AdminPage() {
  const { data, isLoading } = useGetAdminUsers();
  const { mutate: createAdminUser, isPending: isCreating } = useCreateAdminUser();
  const { mutate: updateAdminUser, isPending: isUpdating } = useUpdateAdminUser();
  const { mutate: deleteAdminUser, isPending: isDeleting } = useDeleteAdminUser();

  const adminUsers = useMemo(() => normalizeAdminUsers(data), [data]);

  const [open, setOpen] = useState(false);
  const [selectedAdminUser, setSelectedAdminUser] =
    useState<AdminUserEntity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isSubmitting = isCreating || isUpdating;

  const handleCreateClick = () => {
    setSelectedAdminUser(null);
    setOpen(true);
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelectedAdminUser(null);
    }
  };

  const handleSubmit = (values: AdminUserFormValues) => {
    const id = extractId(selectedAdminUser);

    if (id) {
      const payload = sanitizeUpdatePayload(values);
      updateAdminUser(
        { id, payload },
        {
          onSuccess: () => {
            toast.success("Админ хэрэглэгчийг амжилттай шинэчиллээ.");
            setSelectedAdminUser(null);
            setOpen(false);
          },
          onError: (error) => {
            toast.error(getErrorMessage(error));
          },
        }
      );
      return;
    }

    const payload = sanitizeCreatePayload(values);
    if (!payload.password) {
      toast.error("Нууц үг шаардлагатай.");
      return;
    }

    createAdminUser(payload, {
      onSuccess: () => {
        toast.success("Админ хэрэглэгчийг амжилттай үүсгэлээ.");
        setSelectedAdminUser(null);
        setOpen(false);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const handleEdit = (adminUser: AdminUserEntity) => {
    setSelectedAdminUser(adminUser);
    setOpen(true);
  };

  const handleDelete = (adminUser: AdminUserEntity) => {
    const id = extractId(adminUser);
    if (!id) {
      toast.error("Устгах админ хэрэглэгчийг тодорхойлох боломжгүй байна.");
      return;
    }

    const confirmation = window.confirm(
      "Энэ админ хэрэглэгчийг устгахдаа итгэлтэй байна уу?"
    );

    if (!confirmation) return;

    setDeletingId(id);
    deleteAdminUser(
      { id },
      {
        onSuccess: () => {
          toast.success("Админ хэрэглэгчийг амжилттай устгалаа.");
          if (extractId(selectedAdminUser) === id) {
            setSelectedAdminUser(null);
            setOpen(false);
          }
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
        onSettled: () => {
          setDeletingId(null);
        },
      }
    );
  };

  return (
    <main className="space-y-6">
      <div className="flex justify-end">
        <ButtonWithAdornment
          label="Админ хэрэглэгч нэмэх"
          onClick={handleCreateClick}
          startAdornment={<UserPlus className="h-4 w-4" />}
        />
      </div>
      <AdminUserList
        users={adminUsers}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        activeUserId={extractId(selectedAdminUser)}
        deletingId={deletingId}
        isDeleting={isDeleting}
      />
      <AdminUserDialog
        onOpenChange={handleDialogOpenChange}
        open={open}
        initialValues={selectedAdminUser}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        mode={selectedAdminUser ? "edit" : "create"}
      />
    </main>
  );
}
