"use client";

import { useEffect, useMemo, useState } from "react";

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

import type { TravelPayload } from "../../model";
import { createEmptyTravelPayload } from "../../model";

interface TravelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: TravelPayload | null;
  onSubmit: (values: TravelPayload) => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

const formatDateForInput = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toISOString().slice(0, 10);
};

export default function TravelDialog({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  isSubmitting = false,
  mode = "create",
}: TravelDialogProps) {
  const [formValues, setFormValues] = useState<TravelPayload>(
    createEmptyTravelPayload()
  );

  const normalizedInitialValues = useMemo<TravelPayload>(() => {
    if (!initialValues) {
      return createEmptyTravelPayload();
    }

    return {
      title: initialValues.title ?? "",
      destination: initialValues.destination ?? "",
      date: formatDateForInput(initialValues.date),
      description: initialValues.description ?? "",
      image: initialValues.image ?? "",
    };
  }, [initialValues]);

  useEffect(() => {
    if (!open) {
      setFormValues(createEmptyTravelPayload());
      return;
    }

    setFormValues(normalizedInitialValues);
  }, [open, normalizedInitialValues]);

  const handleFieldChange = <K extends keyof TravelPayload>(
    field: K,
    value: TravelPayload[K]
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DialogHeader className="pb-2 text-left">
            <DialogTitle className="text-lg font-semibold">
              {mode === "edit" ? "Аяллын мэдээлэл засах" : "Аялал нэмэх"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Гарчиг</label>
              <Input
                placeholder="Зуны аялал"
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
                Зорьсон газар
              </label>
              <Input
                placeholder="Бали, Индонез"
                value={formValues.destination}
                onChange={(event) =>
                  handleFieldChange("destination", event.target.value)
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
                onChange={(event) => handleFieldChange("date", event.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Тайлбар
              </label>
              <Textarea
                rows={4}
                placeholder="Энэ аяллын онцлох мөчүүдийг бичнэ үү."
                value={formValues.description}
                onChange={(event) =>
                  handleFieldChange("description", event.target.value)
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Зургийн холбоос</label>
              <Input
                placeholder="https://example.com/travel.jpg"
                value={formValues.image}
                onChange={(event) =>
                  handleFieldChange("image", event.target.value)
                }
                disabled={isSubmitting}
              />
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Хадгалж байна..." : mode === "edit" ? "Шинэчлэх" : "Үүсгэх"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
