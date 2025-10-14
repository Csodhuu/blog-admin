"use client";

import { useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import AlbumDialog from "./components/album-dialog";
import AlbumList from "./components/album-list";
import ButtonWithAdornment from "@/components/form-elements/button-with-adornment";
import {
  useCreateAlbum,
  useDeleteAlbum,
  useGetAlbums,
  useUpdateAlbum,
} from "./hook";
import type { AlbumEntity, AlbumPayload } from "./model";

const normalizeAlbums = (payload: unknown): AlbumEntity[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload as AlbumEntity[];
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: AlbumEntity[] }).data;
  }

  return [];
};

const extractId = (album: AlbumEntity | null) => album?._id ?? album?.id ?? "";

const sanitizePayload = (values: AlbumPayload): AlbumPayload => ({
  title: values.title.trim(),
  description: values.description.trim(),
  year: values.year ? new Date(values.year).toISOString() : "",
  albums: values.albums
    .map((item) => ({
      name: item.name.trim(),
      location: item.location.trim(),
      date: item.date ? new Date(item.date).toISOString() : "",
      cover: item.cover.trim(),
    }))
    .filter((item) => item.name || item.location || item.date || item.cover),
});

const getErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return (
    axiosError?.response?.data?.message ||
    axiosError?.message ||
    "Алдаа гарлаа."
  );
};

export default function AlbumPage() {
  const { data, isLoading } = useGetAlbums();
  const { mutate: createAlbum, isPending: isCreating } = useCreateAlbum();
  const { mutate: updateAlbum, isPending: isUpdating } = useUpdateAlbum();
  const { mutate: deleteAlbum, isPending: isDeleting } = useDeleteAlbum();

  const albums = useMemo(() => normalizeAlbums(data), [data]);

  const [open, setOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumEntity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isSubmitting = isCreating || isUpdating;

  const handleCreateClick = () => {
    setSelectedAlbum(null);
    setOpen(true);
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelectedAlbum(null);
    }
  };

  const handleSubmit = (values: AlbumPayload) => {
    const payload = sanitizePayload(values);
    const id = extractId(selectedAlbum);

    if (id) {
      updateAlbum(
        { id, payload },
        {
          onSuccess: () => {
            toast.success("Зургийн цомгийг амжилттай шинэчиллээ.");
            setSelectedAlbum(null);
            setOpen(false);
          },
          onError: (error) => {
            toast.error(getErrorMessage(error));
          },
        }
      );
      return;
    }

    createAlbum(payload, {
      onSuccess: () => {
        toast.success("Зургийн цомгийг амжилттай үүсгэлээ.");
        setSelectedAlbum(null);
        setOpen(false);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const handleEdit = (album: AlbumEntity) => {
    setSelectedAlbum(album);
    setOpen(true);
  };

  const handleDelete = (album: AlbumEntity) => {
    const id = extractId(album);
    if (!id) {
      toast.error("Устгах зургийн цомгийг тодорхойлж чадсангүй.");
      return;
    }

    const confirmation = window.confirm(
      "Энэ зургийн цомгийг устгах уу?"
    );

    if (!confirmation) return;

    setDeletingId(id);
    deleteAlbum(
      { id },
      {
        onSuccess: () => {
          toast.success("Зургийн цомгийг амжилттай устгалаа.");
          if (extractId(selectedAlbum) === id) {
            setSelectedAlbum(null);
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
          label="Зургийн цомог нэмэх"
          onClick={handleCreateClick}
        />
      </div>
      <AlbumList
        albums={albums}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        activeAlbumId={extractId(selectedAlbum)}
        deletingId={deletingId}
        isDeleting={isDeleting}
      />
      <AlbumDialog
        onOpenChange={handleDialogOpenChange}
        open={open}
        initialValues={selectedAlbum}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        mode={selectedAlbum ? "edit" : "create"}
      />
    </main>
  );
}
