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

import type { ContactEntity, ContactPayload } from "../../hook";

type ContactDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: ContactEntity | null;
  onSubmit: (values: ContactPayload) => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
};

const createEmptyContactPayload = (): ContactPayload => ({
  address: "",
  phone: "",
  email: "",
  socialLinks: [],
  mapPhoto: "",
});

export default function ContactDialog({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  isSubmitting = false,
  mode = "create",
}: ContactDialogProps) {
  const [formValues, setFormValues] = useState<ContactPayload>(
    createEmptyContactPayload()
  );

  const normalizedInitialValues = useMemo<ContactPayload>(() => {
    if (!initialValues) {
      return createEmptyContactPayload();
    }

    return {
      address: initialValues.address ?? "",
      phone: initialValues.phone ?? "",
      email: initialValues.email ?? "",
      mapPhoto: initialValues.mapPhoto ?? "",
      socialLinks: Array.isArray(initialValues.socialLinks)
        ? initialValues.socialLinks.map((link) => ({
            label: link?.label ?? "",
            href: link?.href ?? "",
          }))
        : [],
    };
  }, [initialValues]);

  useEffect(() => {
    if (!open) {
      setFormValues(createEmptyContactPayload());
      return;
    }

    setFormValues(normalizedInitialValues);
  }, [open, normalizedInitialValues]);

  const handleFieldChange = <K extends keyof ContactPayload>(
    field: K,
    value: ContactPayload[K]
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialLinkChange = (
    index: number,
    key: "label" | "href",
    value: string
  ) => {
    setFormValues((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, linkIndex) =>
        linkIndex === index ? { ...link, [key]: value } : link
      ),
    }));
  };

  const handleAddSocialLink = () => {
    setFormValues((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { label: "", href: "" }],
    }));
  };

  const handleRemoveSocialLink = (index: number) => {
    setFormValues((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, linkIndex) => linkIndex !== index),
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
              {mode === "edit"
                ? "Холбоо барих мэдээлэл засах"
                : "Холбоо барих мэдээлэл нэмэх"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Хаяг
              </label>
              <Textarea
                rows={3}
                placeholder="Улаанбаатар хот, Сүхбаатар дүүрэг, 1-р хороо..."
                value={formValues.address}
                onChange={(event) =>
                  handleFieldChange("address", event.target.value)
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Утас</label>
              <Input
                placeholder="(+976) 9999-0000"
                value={formValues.phone}
                onChange={(event) =>
                  handleFieldChange("phone", event.target.value)
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">И-мэйл</label>
              <Input
                type="email"
                placeholder="hello@example.com"
                value={formValues.email}
                onChange={(event) =>
                  handleFieldChange("email", event.target.value)
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Газрын зураг</label>
              <Input
                placeholder="https://maps.example.com/snapshot.jpg"
                value={formValues.mapPhoto}
                onChange={(event) =>
                  handleFieldChange("mapPhoto", event.target.value)
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Нийгмийн сувгийн холбоосууд
              </label>
              <div className="space-y-3">
                {formValues.socialLinks.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Одоогоор нийгмийн сувгийн холбоос нэмэгдээгүй байна. Доорх
                    товчоор нэмнэ үү.
                  </p>
                )}
                {formValues.socialLinks.map((link, index) => (
                  <div
                    key={`${index}-${link.label}-${link.href}`}
                    className="grid gap-3 rounded-md border border-dashed border-gray-200 p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center"
                  >
                    <Input
                      placeholder="Платформын нэр"
                      value={link.label}
                      onChange={(event) =>
                        handleSocialLinkChange(
                          index,
                          "label",
                          event.target.value
                        )
                      }
                      disabled={isSubmitting}
                    />
                    <Input
                      placeholder="https://social.example.com/profile"
                      value={link.href}
                      onChange={(event) =>
                        handleSocialLinkChange(
                          index,
                          "href",
                          event.target.value
                        )
                      }
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSocialLink(index)}
                      disabled={isSubmitting}
                    >
                      Арилгах
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSocialLink}
                disabled={isSubmitting}
              >
                Холбоос нэмэх
              </Button>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-2">
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
                  ? "Өөрчлөлтийг хадгалах"
                  : "Мэдээлэл үүсгэх"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
