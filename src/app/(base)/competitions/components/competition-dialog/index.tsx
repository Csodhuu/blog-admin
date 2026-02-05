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

import type {
  CompetitionDescriptionType,
  CompetitionPayload,
  CompetitionType,
} from "../../model";
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

const COMPETITION_DESCRIPTION_TYPE_OPTIONS: {
  label: string;
  value: CompetitionDescriptionType;
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
    .map((line) => line.replace(/^[-*•]\s+/, "")) // "- ", "* ", "• " эхлэлийг арилгана
    .map((text) => ({ id: uid(), text }));
};

const buildDescriptionFromList = (items: DescriptionListItem[]) => {
  // backend дээр markdown шиг харагдуулахыг хүсвэл "- " нэмж болно:
  // return items.map((i) => `- ${i.text.trim()}`).join("\n");
  return items
    .map((i) => i.text.trim())
    .filter(Boolean)
    .join("\n");
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

  // List UI state
  const [descList, setDescList] = useState<DescriptionListItem[]>([]);
  const [descInput, setDescInput] = useState("");

  const normalizedInitialValues = useMemo<CompetitionPayload>(() => {
    if (!initialValues) return createEmptyCompetitionPayload();

    return {
      title: initialValues.title ?? "",
      sport: initialValues.sport ?? "",
      date: formatDateForInput(initialValues.date),
      endDate: formatDateForInput(initialValues.endDate),
      location: initialValues.location ?? "",
      descriptionType: initialValues.descriptionType ?? "list",
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
      setDescList([]);
      setDescInput("");
      return;
    }

    setFormValues(normalizedInitialValues);
    setIsUploading(false);

    // ✅ list бол description string-ээс list үүсгэнэ
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

  const handleFieldChange = <K extends keyof CompetitionPayload>(
    field: K,
    value: CompetitionPayload[K]
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDescriptionTypeChange = (
    nextType: CompetitionDescriptionType
  ) => {
    setFormValues((prev) => {
      // list -> text : list item-уудыг string болгоно
      if (prev.descriptionType === "list" && nextType === "text") {
        return {
          ...prev,
          descriptionType: nextType,
          description: buildDescriptionFromList(descList),
        };
      }

      // text -> list : description string-ээс list гаргана
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

    // жижиг цэвэрлэгээ
    const cleaned: CompetitionPayload = {
      ...formValues,
      title: (formValues.title ?? "").trim(),
      sport: (formValues.sport ?? "").trim(),
      location: (formValues.location ?? "").trim(),
      link: (formValues.link ?? "").trim(),
      description: finalDescription,
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

  const titleText =
    mode === "edit" ? "Тэмцээний мэдээлэл засах" : "Тэмцээн нэмэх";
  const submitText = isSubmitting
    ? "Хадгалж байна..."
    : mode === "edit"
    ? "Шинэчлэх"
    : "Үүсгэх";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[80%]">
        {/* Scroll area */}
        <div className="max-h-[80vh] overflow-y-auto p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <DialogHeader className="pb-2 text-left">
              <DialogTitle className="text-lg font-semibold">
                {titleText}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
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
                    PDF линк
                  </label>
                  <Input
                    type="url"
                    placeholder="https://...pdf"
                    value={formValues.link}
                    onChange={(event) =>
                      handleFieldChange("link", event.target.value)
                    }
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500">
                    (Заавал биш) PDF / Google Drive / мэдээллийн холбоос оруулж
                    болно.
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
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
                        event.target.value as CompetitionDescriptionType
                      )
                    }
                    disabled={isSubmitting}
                  >
                    {COMPETITION_DESCRIPTION_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ✅ Description (list/text) */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Тайлбар
                  </label>

                  {formValues.descriptionType === "list" ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Жишээ: Насны ангилал U16"
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

                      {/* Preview */}
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
                      rows={3}
                      placeholder="Тэмцээний гол мэдээлэл, нөхцөл, шаардлага гэх мэт..."
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
                    Төрөл
                  </label>
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

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-600">
                      Хуулсан зургийн холбоос
                    </p>

                    {formValues.image ? (
                      <>
                        <a
                          href={formValues.image}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 underline break-words"
                        >
                          {formValues.image}
                        </a>

                        {/* Preview */}
                        <div className="overflow-hidden rounded-lg border border-slate-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={formValues.image}
                            alt="Uploaded preview"
                            className="h-44 w-full object-cover"
                          />
                        </div>
                      </>
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
                {submitText}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
