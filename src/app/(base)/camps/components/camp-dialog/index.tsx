"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
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

import { getUploadErrorMessage, uploadImage } from "@/utils/upload";

import type { CampPayload } from "../../model";
import { createEmptyCampPayload } from "../../model";

interface CampDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: CampPayload | null;
  onSubmit: (values: CampPayload) => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

const formatDateForInput = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toISOString().slice(0, 10);
};

export default function CampDialog({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  isSubmitting = false,
  mode = "create",
}: CampDialogProps) {
  const [formValues, setFormValues] = useState<CampPayload>(
    createEmptyCampPayload()
  );
  const [isUploading, setIsUploading] = useState(false);

  const normalizedInitialValues = useMemo<CampPayload>(() => {
    if (!initialValues) {
      return createEmptyCampPayload();
    }

    return {
      title: initialValues.title ?? "",
      sport: initialValues.sport ?? "",
      date: formatDateForInput(initialValues.date),
      location: initialValues.location ?? "",
      description: initialValues.description ?? "",
      image: initialValues.image ?? "",
    };
  }, [initialValues]);

  useEffect(() => {
    if (!open) {
      setFormValues(createEmptyCampPayload());
      setIsUploading(false);
      return;
    }

    setFormValues(normalizedInitialValues);
    setIsUploading(false);
  }, [open, normalizedInitialValues]);

  const handleFieldChange = <K extends keyof CampPayload>(
    field: K,
    value: CampPayload[K]
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formValues);
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];

    if (!file) {
      input.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const uploadedUrl = await uploadImage(file);

      handleFieldChange("image", uploadedUrl);
      toast.success("Зургийг амжилттай хууллаа.");
    } catch (error) {
      toast.error(getUploadErrorMessage(error));
    } finally {
      setIsUploading(false);
      input.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DialogHeader className="pb-2 text-left">
            <DialogTitle className="text-lg font-semibold">
              {mode === "edit" ? "Зуслангийн мэдээлэл засах" : "Зуслан нэмэх"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Гарчиг</label>
              <Input
                placeholder="Зуны элит зуслан"
                value={formValues.title}
                onChange={(event) =>
                  handleFieldChange("title", event.target.value)
                }
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Спортын төрөл</label>
              <Input
                placeholder="Сагсан бөмбөг"
                value={formValues.sport}
                onChange={(event) =>
                  handleFieldChange("sport", event.target.value)
                }
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Огноо</label>
              <Input
                type="date"
                value={formValues.date}
                onChange={(event) =>
                  handleFieldChange("date", event.target.value)
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Байршил</label>
              <Input
                placeholder="Лос Анжелес, АНУ"
                value={formValues.location}
                onChange={(event) =>
                  handleFieldChange("location", event.target.value)
                }
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Тайлбар
              </label>
              <Textarea
                rows={4}
                placeholder="Энэ зуслангийн онцлог давуу талыг танилцуулна уу."
                value={formValues.description}
                onChange={(event) =>
                  handleFieldChange("description", event.target.value)
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Зураг хуулах
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isSubmitting || isUploading}
              />
              {isUploading && (
                <p className="text-xs text-gray-500">Зургийг хуулж байна...</p>
              )}
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-600">
                  Хуулсан зургийн холбоос
                </p>
                {formValues.image ? (
                  <a
                    href={formValues.image}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 underline break-words"
                  >
                    {formValues.image}
                  </a>
                ) : (
                  <p className="text-xs text-gray-500">
                    Зургийг хуулсны дараа холбоос энд харагдана.
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:space-x-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Цуцлах
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isSubmitting
                ? "Хадгалж байна..."
                : mode === "edit"
                ? "Шинэчлэх"
                : "Үүсгэх"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
