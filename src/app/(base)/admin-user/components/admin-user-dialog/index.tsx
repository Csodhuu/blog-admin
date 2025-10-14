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

import type { AdminUserEntity, AdminUserFormValues } from "../../model";
import { createEmptyAdminUserFormValues } from "../../model";

interface AdminUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: AdminUserEntity | null;
  onSubmit: (values: AdminUserFormValues) => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

export default function AdminUserDialog({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  isSubmitting = false,
  mode = "create",
}: AdminUserDialogProps) {
  const [formValues, setFormValues] = useState<AdminUserFormValues>(
    createEmptyAdminUserFormValues()
  );

  const normalizedInitialValues = useMemo<AdminUserFormValues>(() => {
    if (!initialValues) {
      return createEmptyAdminUserFormValues();
    }

    return {
      username: initialValues.username ?? "",
      email: initialValues.email ?? "",
      password: "",
      iSuperAdmin: Boolean(initialValues.iSuperAdmin),
    };
  }, [initialValues]);

  useEffect(() => {
    if (!open) {
      setFormValues(createEmptyAdminUserFormValues());
      return;
    }

    setFormValues(normalizedInitialValues);
  }, [open, normalizedInitialValues]);

  const handleFieldChange = <K extends keyof AdminUserFormValues>(
    field: K,
    value: AdminUserFormValues[K]
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
              {mode === "edit"
                ? "Админ хэрэглэгчийг засах"
                : "Админ хэрэглэгч нэмэх"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Нэвтрэх нэр
              </label>
              <Input
                placeholder="admin"
                value={formValues.username}
                onChange={(event) =>
                  handleFieldChange("username", event.target.value)
                }
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                И-мэйл
              </label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={formValues.email}
                onChange={(event) =>
                  handleFieldChange("email", event.target.value)
                }
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-700">
                Нууц үг
              </label>
              <Input
                type="password"
                placeholder={
                  mode === "edit"
                    ? "Өмнөх нууц үгийг хэвээр үлдээх бол хоосон орхи"
                    : "Аюулгүй нууц үг"
                }
                value={formValues.password}
                onChange={(event) =>
                  handleFieldChange("password", event.target.value)
                }
                disabled={isSubmitting}
                required={mode === "create"}
                minLength={6}
              />
              {mode === "edit" && (
                <p className="text-xs text-gray-500">
                  Одоогийн нууц үгийг хадгалах бол энэ талбарыг хоосон үлдээгээрэй.
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                id="admin-super-toggle"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={formValues.iSuperAdmin}
                onChange={(event) =>
                  handleFieldChange("iSuperAdmin", event.target.checked)
                }
                disabled={isSubmitting}
              />
              <label
                htmlFor="admin-super-toggle"
                className="text-sm font-medium text-gray-700"
              >
                Супер админ эрх
              </label>
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
                : "Нэмэх"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
