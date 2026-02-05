/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { getUploadErrorMessage, uploadImage } from "@/utils/upload";
import { ImageURL } from "@/lib/authClient";

import type { AlbumItem, AlbumPayload } from "../../model";
import { createEmptyAlbumPayload } from "../../model";
import { useUpdateAlbumItem } from "../../hook";

interface AlbumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: AlbumPayload | null;
  onSubmit: (values: AlbumPayload) => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

const createEmptyAlbumItem = (): AlbumItem => ({
  name: "",
  location: "",
  date: "",
  cover: "",
});

const formatDateForInput = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toISOString().slice(0, 10);
};

export default function AlbumDialog({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  isSubmitting = false,
  mode = "create",
}: AlbumDialogProps) {
  const [formValues, setFormValues] = useState<AlbumPayload>(
    createEmptyAlbumPayload()
  );
  const [uploadingCount, setUploadingCount] = useState(0);
  const isUploading = uploadingCount > 0;

  const normalizedInitialValues = useMemo<AlbumPayload>(() => {
    if (!initialValues) {
      return createEmptyAlbumPayload();
    }

    return {
      title: initialValues.title ?? "",
      description: initialValues.description ?? "",
      year: formatDateForInput(initialValues.year),
      albums: Array.isArray(initialValues.albums)
        ? initialValues.albums.map((album) => ({
            name: "",
            location: "",
            date: "",
            cover: album?.cover ?? "",
          }))
        : [],
    };
  }, [initialValues]);

  useEffect(() => {
    if (!open) {
      setFormValues(createEmptyAlbumPayload());
      setUploadingCount(0);
      return;
    }

    setFormValues(normalizedInitialValues);
    setUploadingCount(0);
  }, [open, normalizedInitialValues]);

  const handleFieldChange = <K extends keyof AlbumPayload>(
    field: K,
    value: AlbumPayload[K]
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateAlbumItem = useUpdateAlbumItem();

  const handleRemoveAlbumItem = (index: number) => {
    const albumId = initialValues?._id ?? (initialValues as any)?.id;

    const currentItem = formValues.albums[index] as any;
    const itemId = currentItem?._id ?? currentItem?.id;

    const prevAlbums = formValues.albums;
    setFormValues((prev) => ({
      ...prev,
      albums: prev.albums.filter((_, i) => i !== index),
    }));

    if (!albumId || !itemId) return;

    console.log({ albumId, itemId });

    updateAlbumItem.mutate(
      { albumId, itemId },
      {
        onSuccess: () => {
          toast.success("Зургийг устгалаа.");
        },
        onError: () => {
          setFormValues((prev) => ({ ...prev, albums: prevAlbums }));
          toast.error("Устгах үед алдаа гарлаа. Дахин оролдоно уу.");
        },
      }
    );
  };

  const handleAlbumImagesUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target;
    const files = Array.from(input.files ?? []);

    if (files.length === 0) {
      input.value = "";
      return;
    }

    setUploadingCount((prev) => prev + files.length);
    let successCount = 0;

    for (const file of files) {
      try {
        const uploadedUrl = await uploadImage(file);

        setFormValues((prev) => ({
          ...prev,
          albums: [
            ...prev.albums,
            {
              ...createEmptyAlbumItem(),
              cover: uploadedUrl,
            },
          ],
        }));
        successCount += 1;
      } catch (error) {
        toast.error(getUploadErrorMessage(error));
      } finally {
        setUploadingCount((prev) => Math.max(prev - 1, 0));
      }
    }

    if (successCount > 0) {
      toast.success(
        successCount === 1
          ? "Зургийг амжилттай хууллаа."
          : `${successCount} зураг амжилттай хууллаа.`
      );
    }

    input.value = "";
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formValues);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DialogHeader className="pb-2 text-left">
            <DialogTitle className="text-lg font-semibold">
              {mode === "edit"
                ? "Зургийн цомгийг засах"
                : "Зургийн цомог нэмэх"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Гарчиг
              </label>
              <Input
                placeholder="Зуны дурсамжууд"
                value={formValues.title}
                onChange={(event) =>
                  handleFieldChange("title", event.target.value)
                }
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Он</label>
              <Input
                type="date"
                value={formValues.year}
                onChange={(event) =>
                  handleFieldChange("year", event.target.value)
                }
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Тайлбар
              </label>
              <Textarea
                rows={4}
                placeholder="Мартагдашгүй мөчүүдийн түүвэр."
                value={formValues.description}
                onChange={(event) =>
                  handleFieldChange("description", event.target.value)
                }
                disabled={isSubmitting}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">
                Цомгийн зургууд
              </h3>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Зураг нэмэх
              </label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAlbumImagesUpload}
                disabled={isSubmitting || isUploading}
              />
              {isUploading && (
                <p className="text-xs text-gray-500">
                  Зургийг хуулж байна... ({uploadingCount})
                </p>
              )}
              <p className="text-xs text-gray-500">
                Нэг дор олон зураг сонгож болно.
              </p>
            </div>

            {formValues.albums.length === 0 ? (
              <p className="text-sm text-gray-500">
                Одоогоор зураг алга. &ldquo;Зураг нэмэх&rdquo; хэсгээс зургаа
                сонгож оруулна уу.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {formValues.albums.map((album, index) => (
                  <div
                    key={`album-item-${index}`}
                    className="relative overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm"
                  >
                    {album.cover ? (
                      <img
                        src={ImageURL + album.cover}
                        alt={`Цомгийн зураг ${index + 1}`}
                        className="h-40 w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center text-xs text-gray-400">
                        Зураг алга
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={() => handleRemoveAlbumItem(index)}
                      disabled={isSubmitting || isUploading}
                      aria-label="Зургийг устгах"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Цуцлах
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isSubmitting
                ? mode === "edit"
                  ? "Шинэчилж байна..."
                  : "Үүсгэж байна..."
                : mode === "edit"
                ? "Өөрчлөлтийг хадгалах"
                : "Цомог үүсгэх"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
