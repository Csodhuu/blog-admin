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

import type { AboutEntity, AboutPayload } from "../../hook";

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: AboutEntity | null;
  onSubmit: (values: AboutPayload) => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

const createEmptyFormState = (): AboutPayload => ({
  paragraphImage: "",
  title: "",
  content: "",
  timeline: [],
  achievements: [],
  paragraphs: [],
  capabilities: [],
});

const normalizeInitialValues = (initialValues?: AboutEntity | null) => {
  if (!initialValues) return createEmptyFormState();

  return {
    paragraphImage: initialValues.paragraphImage ?? "",
    title: initialValues.title ?? "",
    content: initialValues.content ?? "",
    timeline: Array.isArray(initialValues.timeline)
      ? initialValues.timeline.map((item) => ({
          year: item?.year ?? "",
          milestone: item?.milestone ?? "",
        }))
      : [],
    achievements: Array.isArray(initialValues.achievements)
      ? initialValues.achievements.map((item) => item ?? "")
      : [],
    paragraphs: Array.isArray(initialValues.paragraphs)
      ? initialValues.paragraphs.map((item) => item ?? "")
      : [],
    capabilities: Array.isArray(initialValues.capabilities)
      ? initialValues.capabilities.map((item) => ({
          title: item?.title ?? "",
          description: item?.description ?? "",
        }))
      : [],
  } satisfies AboutPayload;
};

export default function AboutDialog({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  isSubmitting = false,
  mode = "create",
}: AboutDialogProps) {
  const normalizedInitialValues = useMemo(
    () => normalizeInitialValues(initialValues),
    [initialValues]
  );

  const [formValues, setFormValues] = useState<AboutPayload>(
    createEmptyFormState()
  );

  useEffect(() => {
    if (!open) {
      setFormValues(createEmptyFormState());
      return;
    }

    setFormValues(normalizedInitialValues);
  }, [open, normalizedInitialValues]);

  const handleFieldChange = <K extends keyof AboutPayload>(
    field: K,
    value: AboutPayload[K]
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTimelineChange = (
    index: number,
    key: "year" | "milestone",
    value: string
  ) => {
    setFormValues((prev) => ({
      ...prev,
      timeline: prev.timeline.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const handleCapabilityChange = (
    index: number,
    key: "title" | "description",
    value: string
  ) => {
    setFormValues((prev) => ({
      ...prev,
      capabilities: prev.capabilities.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const handleArrayTextChange = (
    field: "achievements" | "paragraphs",
    index: number,
    value: string
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: prev[field].map((item, itemIndex) =>
        itemIndex === index ? value : item
      ),
    }));
  };

  const addTimelineItem = () => {
    setFormValues((prev) => ({
      ...prev,
      timeline: [...prev.timeline, { year: "", milestone: "" }],
    }));
  };

  const removeTimelineItem = (index: number) => {
    setFormValues((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const addCapabilityItem = () => {
    setFormValues((prev) => ({
      ...prev,
      capabilities: [...prev.capabilities, { title: "", description: "" }],
    }));
  };

  const removeCapabilityItem = (index: number) => {
    setFormValues((prev) => ({
      ...prev,
      capabilities: prev.capabilities.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  const addArrayTextItem = (field: "achievements" | "paragraphs") => {
    setFormValues((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayTextItem = (
    field: "achievements" | "paragraphs",
    index: number
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formValues);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DialogHeader className="text-left">
            <DialogTitle className="text-lg font-semibold">
              {mode === "edit"
                ? "Танилцуулгын бичлэгийг засах"
                : "Танилцуулгын бичлэг үүсгэх"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Гарчиг</label>
              <Input
                placeholder="Бидний тухай"
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
                Нүүр зургийн холбоос
              </label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={formValues.paragraphImage}
                onChange={(event) =>
                  handleFieldChange("paragraphImage", event.target.value)
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Танилцуулгын агуулга
              </label>
              <Textarea
                placeholder="Өөрсдийн түүх, үнэт зүйл, эрхэм зорилгоо хуваалцаарай."
                value={formValues.content}
                onChange={(event) =>
                  handleFieldChange("content", event.target.value)
                }
                disabled={isSubmitting}
                rows={4}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Цаг хугацааны шугам
                  </h3>
                  <p className="text-xs text-gray-500">
                    Он онуудад болсон чухал үйл явдлуудыг онцолж харуулаарай.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addTimelineItem}
                  disabled={isSubmitting}
                >
                  Үйл явдал нэмэх
                </Button>
              </div>
              {formValues.timeline.length === 0 && (
                <p className="text-sm text-gray-500">
                  Одоогоор үйл явдал нэмэгдээгүй байна.
                </p>
              )}
              <div className="space-y-3">
                {formValues.timeline.map((item, index) => (
                  <div
                    key={`timeline-${index}`}
                    className="space-y-3 rounded-lg border border-gray-200 p-4"
                  >
                    <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                      <div className="grid gap-2">
                        <label className="text-xs font-medium text-gray-500">
                          Он
                        </label>
                        <Input
                          placeholder="2020"
                          value={item.year}
                          onChange={(event) =>
                            handleTimelineChange(
                              index,
                              "year",
                              event.target.value
                            )
                          }
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-xs font-medium text-gray-500">
                          Үйл явдал
                        </label>
                        <Input
                          placeholder="Компанийн үүсгэн байгуулав"
                          value={item.milestone}
                          onChange={(event) =>
                            handleTimelineChange(
                              index,
                              "milestone",
                              event.target.value
                            )
                          }
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimelineItem(index)}
                        disabled={isSubmitting}
                      >
                        Арилгах
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Амжилтууд
                  </h3>
                  <p className="text-xs text-gray-500">
                    Багийнхаа бахархал болсон амжилтуудыг жагсаагаарай.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addArrayTextItem("achievements")}
                  disabled={isSubmitting}
                >
                  Амжилт нэмэх
                </Button>
              </div>
              {formValues.achievements.length === 0 && (
                <p className="text-sm text-gray-500">
                  Одоогоор амжилт нэмэгдээгүй байна.
                </p>
              )}
              <div className="space-y-3">
                {formValues.achievements.map((achievement, index) => (
                  <div key={`achievement-${index}`} className="flex gap-3">
                    <Input
                      placeholder="2023 оны шилдэг стартапын шагнал"
                      value={achievement}
                      onChange={(event) =>
                        handleArrayTextChange(
                          "achievements",
                          index,
                          event.target.value
                        )
                      }
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayTextItem("achievements", index)}
                      disabled={isSubmitting}
                    >
                      Арилгах
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Догол мөрүүд
                  </h3>
                  <p className="text-xs text-gray-500">
                    Түүхээ уншихад ойлгомжтой хэсгүүдэд хуваагаарай.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addArrayTextItem("paragraphs")}
                  disabled={isSubmitting}
                >
                  Догол мөр нэмэх
                </Button>
              </div>
              {formValues.paragraphs.length === 0 && (
                <p className="text-sm text-gray-500">
                  Одоогоор догол мөр нэмэгдээгүй байна.
                </p>
              )}
              <div className="space-y-3">
                {formValues.paragraphs.map((paragraph, index) => (
                  <div key={`paragraph-${index}`} className="space-y-2">
                    <Textarea
                      placeholder="Бид агуу алсын хараатай жижигхэн баг байдлаар эхэлсэн..."
                      value={paragraph}
                      onChange={(event) =>
                        handleArrayTextChange(
                          "paragraphs",
                          index,
                          event.target.value
                        )
                      }
                      disabled={isSubmitting}
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayTextItem("paragraphs", index)}
                        disabled={isSubmitting}
                      >
                        Арилгах
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Чадварууд
                  </h3>
                  <p className="text-xs text-gray-500">
                    Танай байгууллагыг тодорхойлдог үйлчилгээ, ур чадваруудыг
                    жагсаана уу.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addCapabilityItem}
                  disabled={isSubmitting}
                >
                  Чадвар нэмэх
                </Button>
              </div>
              {formValues.capabilities.length === 0 && (
                <p className="text-sm text-gray-500">
                  Одоогоор чадвар нэмэгдээгүй байна.
                </p>
              )}
              <div className="space-y-4">
                {formValues.capabilities.map((capability, index) => (
                  <div
                    key={`capability-${index}`}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                      <div className="grid gap-2">
                        <label className="text-xs font-medium text-gray-500">
                          Гарчиг
                        </label>
                        <Input
                          placeholder="Зөвлөх үйлчилгээ"
                          value={capability.title}
                          onChange={(event) =>
                            handleCapabilityChange(
                              index,
                              "title",
                              event.target.value
                            )
                          }
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-xs font-medium text-gray-500">
                          Тайлбар
                        </label>
                        <Textarea
                          placeholder="Бид багуудад нарийн төвөгтэй дижитал өөрчлөлтийг хэрэгжүүлэхэд тусалдаг."
                          value={capability.description}
                          onChange={(event) =>
                            handleCapabilityChange(
                              index,
                              "description",
                              event.target.value
                            )
                          }
                          disabled={isSubmitting}
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCapabilityItem(index)}
                        disabled={isSubmitting}
                      >
                        Арилгах
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Цуцлах
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {mode === "edit" ? "Бичлэгийг шинэчлэх" : "Бичлэг үүсгэх"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
