"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

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

import type { AlbumItem, AlbumPayload } from "../../model";
import { createEmptyAlbumPayload } from "../../model";

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
            name: album?.name ?? "",
            location: album?.location ?? "",
            date: formatDateForInput(album?.date),
            cover: album?.cover ?? "",
          }))
        : [],
    };
  }, [initialValues]);

  useEffect(() => {
    if (!open) {
      setFormValues(createEmptyAlbumPayload());
      return;
    }

    setFormValues(normalizedInitialValues);
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

  const handleAlbumItemChange = <K extends keyof AlbumItem>(
    index: number,
    field: K,
    value: AlbumItem[K]
  ) => {
    setFormValues((prev) => ({
      ...prev,
      albums: prev.albums.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }));
  };

  const handleAddAlbumItem = () => {
    setFormValues((prev) => ({
      ...prev,
      albums: [...prev.albums, createEmptyAlbumItem()],
    }));
  };

  const handleRemoveAlbumItem = (index: number) => {
    setFormValues((prev) => ({
      ...prev,
      albums: prev.albums.filter((_, itemIndex) => itemIndex !== index),
    }));
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
              {mode === "edit" ? "Update album" : "Create album"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <Input
                placeholder="Summer Memories"
                value={formValues.title}
                onChange={(event) =>
                  handleFieldChange("title", event.target.value)
                }
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Year</label>
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
                Description
              </label>
              <Textarea
                rows={4}
                placeholder="A collection of unforgettable moments."
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
                Album entries
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddAlbumItem}
                disabled={isSubmitting}
              >
                <Plus className="mr-2 h-4 w-4" /> Add entry
              </Button>
            </div>

            {formValues.albums.length === 0 ? (
              <p className="text-sm text-gray-500">
                No entries yet. Use the &quot;Add entry&quot; button to include photos
                or events in this album.
              </p>
            ) : (
              <div className="space-y-4">
                {formValues.albums.map((album, index) => (
                  <div
                    key={`album-item-${index}`}
                    className="rounded-lg border border-gray-200 p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <Input
                          placeholder="Sunset at the beach"
                          value={album.name}
                          onChange={(event) =>
                            handleAlbumItemChange(
                              index,
                              "name",
                              event.target.value
                            )
                          }
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <Input
                          placeholder="Santa Monica, CA"
                          value={album.location}
                          onChange={(event) =>
                            handleAlbumItemChange(
                              index,
                              "location",
                              event.target.value
                            )
                          }
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-gray-700">
                          Date
                        </label>
                        <Input
                          type="date"
                          value={album.date}
                          onChange={(event) =>
                            handleAlbumItemChange(
                              index,
                              "date",
                              event.target.value
                            )
                          }
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium text-gray-700">
                          Cover image URL
                        </label>
                        <Input
                          placeholder="https://example.com/cover.jpg"
                          value={album.cover}
                          onChange={(event) =>
                            handleAlbumItemChange(
                              index,
                              "cover",
                              event.target.value
                            )
                          }
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAlbumItem(index)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Remove entry
                      </Button>
                    </div>
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
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? mode === "edit"
                  ? "Updating..."
                  : "Creating..."
                : mode === "edit"
                ? "Save changes"
                : "Create album"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
