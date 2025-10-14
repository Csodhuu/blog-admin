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
import { cn } from "@/lib/utils";

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
    };
  }, [initialValues]);

  useEffect(() => {
    if (!open) {
      setFormValues(createEmptyCompetitionPayload());
      return;
    }

    setFormValues(normalizedInitialValues);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DialogHeader className="pb-2 text-left">
            <DialogTitle className="text-lg font-semibold">
              {mode === "edit" ? "Тэмцээний мэдээлэл засах" : "Тэмцээн нэмэх"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Гарчиг</label>
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
              <label className="text-sm font-medium text-gray-700">Тайлбар</label>
              <Textarea
                rows={4}
                placeholder="Тэмцээний гол мэдээллийг бичнэ үү."
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
                placeholder="https://example.com/event.jpg"
                value={formValues.image}
                onChange={(event) =>
                  handleFieldChange("image", event.target.value)
                }
                disabled={isSubmitting}
              />
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
                  handleFieldChange("type", event.target.value as CompetitionType)
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
            <Button type="submit" disabled={isSubmitting}>
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
