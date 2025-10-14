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
      return;
    }

    setFormValues(normalizedInitialValues);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DialogHeader className="pb-2 text-left">
            <DialogTitle className="text-lg font-semibold">
              {mode === "edit" ? "Update camp" : "Create camp"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <Input
                placeholder="Elite Summer Camp"
                value={formValues.title}
                onChange={(event) =>
                  handleFieldChange("title", event.target.value)
                }
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Sport</label>
              <Input
                placeholder="Basketball"
                value={formValues.sport}
                onChange={(event) =>
                  handleFieldChange("sport", event.target.value)
                }
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Date</label>
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
              <label className="text-sm font-medium text-gray-700">Location</label>
              <Input
                placeholder="Los Angeles, CA"
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
                Description
              </label>
              <Textarea
                rows={4}
                placeholder="Tell participants what makes this camp special."
                value={formValues.description}
                onChange={(event) =>
                  handleFieldChange("description", event.target.value)
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Image</label>
              <Input
                placeholder="https://example.com/camp.jpg"
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
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : mode === "edit" ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
