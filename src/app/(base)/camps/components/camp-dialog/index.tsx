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

import type { CampDescriptionType, CampPayload } from "../../model";
import { createEmptyCampPayload } from "../../model";

interface CampDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: CampPayload | null;
  onSubmit: (values: CampPayload) => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

const DESCRIPTION_TYPE_OPTIONS: {
  label: string;
  value: CampDescriptionType;
}[] = [
  { label: "Жагсаалт", value: "list" },
  { label: "Үргэлжилсэн текст", value: "text" },
];

const formatDateForInput = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toISOString().slice(0, 10);
};

// ---------- List helpers ----------
type DescriptionListItem = { id: string; text: string };

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const parseListFromDescription = (
  raw?: string | null
): DescriptionListItem[] => {
  const value = (raw ?? "").trim();
  if (!value) return [];

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*•]\s+/, ""))
    .map((text) => ({ id: uid(), text }));
};

const buildDescriptionFromList = (items: DescriptionListItem[]) => {
  return items
    .map((i) => i.text.trim())
    .filter(Boolean)
    .join("\n");
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

  // List UI state
  const [descList, setDescList] = useState<DescriptionListItem[]>([]);
  const [descInput, setDescInput] = useState("");

  const normalizedInitialValues = useMemo<CampPayload>(() => {
    if (!initialValues) {
      return createEmptyCampPayload();
    }

    return {
      title: initialValues.title ?? "",
      sport: initialValues.sport ?? "",
      date: formatDateForInput(initialValues.date),
      endDate: formatDateForInput(initialValues.endDate),
      location: initialValues.location ?? "",
      descriptionType: initialValues.descriptionType ?? "list",
      description: initialValues.description ?? "",
      image: initialValues.image ?? "",
    };
  }, [initialValues]);

  useEffect(() => {
    if (!open) {
      setFormValues(createEmptyCampPayload());
      setIsUploading(false);
      setDescList([]);
      setDescInput("");
      return;
    }

    setFormValues(normalizedInitialValues);
    setIsUploading(false);

    if ((normalizedInitialValues.descriptionType ?? "list") === "list") {
      setDescList(
        parseListFromDescription(normalizedInitialValues.description)
      );
      setDescInput("");
    } else {
      setDescList([]);
      setDescInput("");
    }
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

  const handleDescriptionTypeChange = (nextType: CampDescriptionType) => {
    setFormValues((prev) => {
      if (prev.descriptionType === "list" && nextType === "text") {
        return {
          ...prev,
          descriptionType: nextType,
          description: buildDescriptionFromList(descList),
        };
      }

      if (prev.descriptionType === "text" && nextType === "list") {
        const items = parseListFromDescription(prev.description);
        setDescList(items);
        setDescInput("");
        return { ...prev, descriptionType: nextType };
      }

      return { ...prev, descriptionType: nextType };
    });
  };

  const addDescItem = () => {
    const text = descInput.trim();
    if (!text) return;

    setDescList((prev) => [...prev, { id: uid(), text }]);
    setDescInput("");
  };

  const removeDescItem = (id: string) => {
    setDescList((prev) => prev.filter((i) => i.id !== id));
  };

  const updateDescItem = (id: string, text: string) => {
    setDescList((prev) => prev.map((i) => (i.id === id ? { ...i, text } : i)));
  };

  const onDescInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addDescItem();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const finalDescription =
      formValues.descriptionType === "list"
        ? buildDescriptionFromList(descList)
        : formValues.description ?? "";

    const cleaned: CampPayload = {
      ...formValues,
      title: (formValues.title ?? "").trim(),
      sport: (formValues.sport ?? "").trim(),
      location: (formValues.location ?? "").trim(),
      description: finalDescription,
      image: (formValues.image ?? "").trim(),
    };

    onSubmit(cleaned);
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
      <DialogContent className="min-w-[80%]">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DialogHeader className="pb-2 text-left">
            <DialogTitle className="text-lg font-semibold">
              {mode === "edit" ? "Зуслангийн мэдээлэл засах" : "Зуслан нэмэх"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Гарчиг
                </label>
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
                <label className="text-sm font-medium text-gray-700">
                  Эхлэх огноо
                </label>
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
                  Дуусах огноо
                </label>
                <Input
                  type="date"
                  value={formValues.endDate}
                  onChange={(event) =>
                    handleFieldChange("endDate", event.target.value)
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
            </div>

            <div className="grid gap-4 overflow-y-scroll h-[400px]">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Тайлбарын төрөл
                </label>
                <select
                  className={cn(
                    "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow]",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  )}
                  value={formValues.descriptionType}
                  onChange={(event) =>
                    handleDescriptionTypeChange(
                      event.target.value as CampDescriptionType
                    )
                  }
                  disabled={isSubmitting}
                >
                  {DESCRIPTION_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Тайлбар
                </label>

                {formValues.descriptionType === "list" ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Жишээ: 7 хоногийн хөтөлбөр"
                        value={descInput}
                        onChange={(e) => setDescInput(e.target.value)}
                        onKeyDown={onDescInputKeyDown}
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        onClick={addDescItem}
                        disabled={isSubmitting || !descInput.trim()}
                      >
                        Нэмэх
                      </Button>
                    </div>

                    {descList.length > 0 ? (
                      <div className="space-y-2">
                        {descList.map((item, idx) => (
                          <div
                            key={item.id}
                            className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-2"
                          >
                            <div className="mt-2 text-xs text-slate-400 w-6 text-center">
                              {idx + 1}
                            </div>

                            <Input
                              value={item.text}
                              onChange={(e) =>
                                updateDescItem(item.id, e.target.value)
                              }
                              disabled={isSubmitting}
                            />

                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => removeDescItem(item.id)}
                              disabled={isSubmitting}
                            >
                              Устгах
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">
                        Одоогоор жагсаалтын мөр алга. Нэг мөр бичээд “Нэмэх”
                        дарна уу.
                      </p>
                    )}

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-medium text-slate-600 mb-2">
                        Preview
                      </p>
                      <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                        {descList.map((i) => (
                          <li key={i.id}>{i.text}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <Textarea
                    rows={4}
                    placeholder="Энэ зуслангийн онцлог давуу талыг танилцуулна уу."
                    value={formValues.description}
                    onChange={(event) =>
                      handleFieldChange("description", event.target.value)
                    }
                    disabled={isSubmitting}
                  />
                )}
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
                  <p className="text-xs text-gray-500">
                    Зургийг хуулж байна...
                  </p>
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
