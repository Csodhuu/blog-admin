"use client";

import { useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { TentTree } from "lucide-react";

import ButtonWithAdornment from "@/components/form-elements/button-with-adornment";

import CampDialog from "./components/camp-dialog";
import CampList from "./components/camp-list";
import {
  useCreateCamp,
  useDeleteCamp,
  useGetCamps,
  useUpdateCamp,
} from "./hook";
import type { CampEntity, CampPayload } from "./model";

const normalizeCamps = (payload: unknown): CampEntity[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload as CampEntity[];
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: CampEntity[] }).data;
  }

  return [];
};

const extractId = (camp: CampEntity | null) => camp?._id ?? camp?.id ?? "";

const sanitizePayload = (values: CampPayload): CampPayload => ({
  title: values.title.trim(),
  sport: values.sport.trim(),
  date: values.date ? new Date(values.date).toISOString() : "",
  location: values.location.trim(),
  description: values.description.trim(),
  image: values.image.trim(),
});

const getErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return (
    axiosError?.response?.data?.message ||
    axiosError?.message ||
    "Something went wrong."
  );
};

export default function CampPage() {
  const { data, isLoading } = useGetCamps();
  const { mutate: createCamp, isPending: isCreating } = useCreateCamp();
  const { mutate: updateCamp, isPending: isUpdating } = useUpdateCamp();
  const { mutate: deleteCamp, isPending: isDeleting } = useDeleteCamp();

  const camps = useMemo(() => normalizeCamps(data), [data]);

  const [open, setOpen] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState<CampEntity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isSubmitting = isCreating || isUpdating;

  const handleCreateClick = () => {
    setSelectedCamp(null);
    setOpen(true);
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelectedCamp(null);
    }
  };

  const handleSubmit = (values: CampPayload) => {
    const payload = sanitizePayload(values);
    const id = extractId(selectedCamp);

    if (id) {
      updateCamp(
        { id, payload },
        {
          onSuccess: () => {
            toast.success("Camp updated successfully.");
            setSelectedCamp(null);
            setOpen(false);
          },
          onError: (error) => {
            toast.error(getErrorMessage(error));
          },
        }
      );
      return;
    }

    createCamp(payload, {
      onSuccess: () => {
        toast.success("Camp created successfully.");
        setSelectedCamp(null);
        setOpen(false);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const handleEdit = (camp: CampEntity) => {
    setSelectedCamp(camp);
    setOpen(true);
  };

  const handleDelete = (camp: CampEntity) => {
    const id = extractId(camp);
    if (!id) {
      toast.error("Unable to determine which camp to delete.");
      return;
    }

    const confirmation = window.confirm(
      "Are you sure you want to delete this camp?"
    );

    if (!confirmation) return;

    setDeletingId(id);
    deleteCamp(
      { id },
      {
        onSuccess: () => {
          toast.success("Camp deleted successfully.");
          if (extractId(selectedCamp) === id) {
            setSelectedCamp(null);
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
          label="Create camp"
          onClick={handleCreateClick}
          startAdornment={<TentTree className="h-4 w-4" />}
        />
      </div>
      <CampList
        camps={camps}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        activeCampId={extractId(selectedCamp)}
        deletingId={deletingId}
        isDeleting={isDeleting}
      />
      <CampDialog
        onOpenChange={handleDialogOpenChange}
        open={open}
        initialValues={selectedCamp}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        mode={selectedCamp ? "edit" : "create"}
      />
    </main>
  );
}
