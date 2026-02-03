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
import { cn } from "@/lib/utils";

import { getUploadErrorMessage, uploadImage } from "@/utils/upload";

import type { CompetitionPayload, CompetitionType } from "../../model";
import { createEmptyCompetitionPayload } from "../../model";

interface CompetitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: CompetitionPayload | null;
  onSubmit: (values: CompetitionPayload) => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

const COMPETITION_TYPE_OPTIONS: { label: string; value: CompetitionType }[] = [
  { label: "Удахгүй болох", value: "upcomingEvents" },
  { label: "Өнгөрсөн арга хэмжээ", value: "pastEvents" },
];

const formatDateForInput = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toISOString().slice(0, 10);
};

export default function CompetitionDialog({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  isSubmitting = false,
  mode = "create",
}: CompetitionDialogProps) {
  const [formValues, setFormValues] = useState<CompetitionPayload>(
    createEmptyCompetitionPayload()
  );
  const [isUploading, setIsUploading] = useState(false);

  const normalizedInitialValues = useMemo<CompetitionPayload>(() => {
    if (!initialValues) {
      return createEmptyCompetitionPayload();
    }

    return {
      title: initialValues.title ?? "",
      sport: initialValues.sport ?? "",
      date: formatDateForInput(initialValues.date),
      location: initialValues.location ?? "",
      description: initialValues.description ?? "",
      image: initialValues.image ?? "",
      type: initialValues.type ?? "upcomingEvents",
      link: initialValues.link ?? "",
    };
  }, [initialValues]);

  useEffect(() => {
    if (!open) {
      setFormValues(createEmptyCompetitionPayload());
      setIsUploading(false);
      return;
    }

    setFormValues(normalizedInitialValues);
    setIsUploading(false);
  }, [open, normalizedInitialValues]);

  const handleFieldChange = <K extends keyof CompetitionPayload>(
    field: K,
    value: CompetitionPayload[K]
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
      <DialogContent className="sm:max-w-lg overflow-y-scroll h-[850px] ">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DialogHeader className="pb-2 text-left">
            <DialogTitle className="text-lg font-semibold">
              {mode === "edit" ? "Тэмцээний мэдээлэл засах" : "Тэмцээн нэмэх"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Гарчиг
              </label>
              <Input
                placeholder="Элит аваргын финал"
                value={formValues.title}
                onChange={(event) =>
                  handleFieldChange("title", event.target.value)
                }
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Спортын төрөл
              </label>
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
              <label className="text-sm font-medium text-gray-700">
                PDF liink
              </label>
              <Input
                type="text"
                value={formValues.link}
                onChange={(event) =>
                  handleFieldChange("link", event.target.value)
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Байршил
              </label>
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
                rows={2}
                placeholder="Тэмцээний гол мэдээллийг бичнэ үү."
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

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Төрөл</label>
              <select
                className={cn(
                  "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow]",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                )}
                value={formValues.type}
                onChange={(event) =>
                  handleFieldChange(
                    "type",
                    event.target.value as CompetitionType
                  )
                }
                disabled={isSubmitting}
              >
                {COMPETITION_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
