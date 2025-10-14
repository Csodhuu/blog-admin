"use client";

import { useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { PlaneTakeoff } from "lucide-react";

import ButtonWithAdornment from "@/components/form-elements/button-with-adornment";

import TravelDialog from "./components/travel-dialog";
import TravelList from "./components/travel-list";
import {
  useCreateTravel,
  useDeleteTravel,
  useGetTravels,
  useUpdateTravel,
} from "./hook";
import type { TravelEntity, TravelPayload } from "./model";

const normalizeTravels = (payload: unknown): TravelEntity[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload as TravelEntity[];
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: TravelEntity[] }).data;
  }

  return [];
};

const extractId = (travel: TravelEntity | null) => travel?._id ?? travel?.id ?? "";

const sanitizePayload = (values: TravelPayload): TravelPayload => ({
  title: values.title.trim(),
  destination: values.destination.trim(),
  date: values.date ? new Date(values.date).toISOString() : "",
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

export default function TravelPage() {
  const { data, isLoading } = useGetTravels();
  const { mutate: createTravel, isPending: isCreating } = useCreateTravel();
  const { mutate: updateTravel, isPending: isUpdating } = useUpdateTravel();
  const { mutate: deleteTravel, isPending: isDeleting } = useDeleteTravel();

  const travels = useMemo(() => normalizeTravels(data), [data]);

  const [open, setOpen] = useState(false);
  const [selectedTravel, setSelectedTravel] = useState<TravelEntity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isSubmitting = isCreating || isUpdating;

  const handleCreateClick = () => {
    setSelectedTravel(null);
    setOpen(true);
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelectedTravel(null);
    }
  };

  const handleSubmit = (values: TravelPayload) => {
    const payload = sanitizePayload(values);
    const id = extractId(selectedTravel);

    if (id) {
      updateTravel(
        { id, payload },
        {
          onSuccess: () => {
            toast.success("Travel updated successfully.");
            setSelectedTravel(null);
            setOpen(false);
          },
          onError: (error) => {
            toast.error(getErrorMessage(error));
          },
        }
      );
      return;
    }

    createTravel(payload, {
      onSuccess: () => {
        toast.success("Travel created successfully.");
        setSelectedTravel(null);
        setOpen(false);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const handleEdit = (travel: TravelEntity) => {
    setSelectedTravel(travel);
    setOpen(true);
  };

  const handleDelete = (travel: TravelEntity) => {
    const id = extractId(travel);
    if (!id) {
      toast.error("Unable to determine which travel experience to delete.");
      return;
    }

    const confirmation = window.confirm(
      "Are you sure you want to delete this travel experience?"
    );

    if (!confirmation) return;

    setDeletingId(id);
    deleteTravel(
      { id },
      {
        onSuccess: () => {
          toast.success("Travel deleted successfully.");
          if (extractId(selectedTravel) === id) {
            setSelectedTravel(null);
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
          label="Create travel"
          onClick={handleCreateClick}
          startAdornment={<PlaneTakeoff className="h-4 w-4" />}
        />
      </div>
      <TravelList
        travels={travels}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        activeTravelId={extractId(selectedTravel)}
        deletingId={deletingId}
        isDeleting={isDeleting}
      />
      <TravelDialog
        onOpenChange={handleDialogOpenChange}
        open={open}
        initialValues={selectedTravel}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        mode={selectedTravel ? "edit" : "create"}
      />
    </main>
  );
}
