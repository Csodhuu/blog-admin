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

import { getUploadErrorMessage, uploadImage } from "@/utils/upload";
import { createPartnerPayload, type PartnerPayload } from "../model";

interface PartnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: PartnerPayload | null;
  onSubmit: (values: PartnerPayload) => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

export default function PartnerDialog({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  isSubmitting = false,
  mode = "create",
}: PartnerDialogProps) {
  const [formValues, setFormValues] = useState<PartnerPayload>(
    createPartnerPayload()
  );
  const [isUploading, setIsUploading] = useState(false);

  const normalizedInitialValues = useMemo<PartnerPayload>(() => {
    if (!initialValues) {
      return createPartnerPayload();
    }

    return {
      name: initialValues.name ?? "",
      image: initialValues.image ?? "",
    };
  }, [initialValues]);

  useEffect(() => {
    if (!open) {
      setFormValues(createPartnerPayload());
      setIsUploading(false);
      return;
    }

    setFormValues(normalizedInitialValues);
    setIsUploading(false);
  }, [open, normalizedInitialValues]);

  const handleFieldChange = <K extends keyof PartnerPayload>(
    field: K,
    value: PartnerPayload[K]
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
              {mode === "edit"
                ? "Хамтрагч байгууллагын мэдээлэл засах"
                : "Хамтрагч байгууллага нэмэх"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Нэр</label>
              <Input
                placeholder="Нэр"
                value={formValues.name}
                onChange={(event) =>
                  handleFieldChange("name", event.target.value)
                }
                disabled={isSubmitting}
                required
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
                    {/* {formValues.image} */}
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
