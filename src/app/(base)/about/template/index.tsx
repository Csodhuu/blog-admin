/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  type AboutEntity,
  type AboutPayload,
  useCreateAbout,
  useDeleteAbout,
  useGetAbout,
  useUpdateAbout,
} from "../hook";

type AboutFormValues = AboutPayload;

const createEmptyFormState = (): AboutFormValues => ({
  paragraphImage: "",
  title: "",
  content: "",
  timeline: [],
  achievements: [],
  paragraphs: [],
  capabilities: [],
});

const normalizeAbouts = (payload: unknown): AboutEntity[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload as AboutEntity[];
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: AboutEntity[] }).data;
  }

  return [];
};

const extractId = (about: AboutEntity | null) => about?._id ?? about?.id ?? "";

export default function AboutClient() {
  const { data, isLoading } = useGetAbout();
  const { mutate: createAbout, isPending: isCreating } = useCreateAbout();
  const { mutate: updateAbout, isPending: isUpdating } = useUpdateAbout();
  const { mutate: deleteAbout, isPending: isDeleting } = useDeleteAbout();

  const abouts = useMemo(() => normalizeAbouts(data), [data]);

  const [selectedAbout, setSelectedAbout] = useState<AboutEntity | null>(null);
  const [formValues, setFormValues] = useState<AboutFormValues>(
    createEmptyFormState()
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedAbout) {
      setFormValues(createEmptyFormState());
      return;
    }

    setFormValues({
      paragraphImage: selectedAbout.paragraphImage ?? "",
      title: selectedAbout.title ?? "",
      content: selectedAbout.content ?? "",
      timeline: selectedAbout.timeline ?? [],
      achievements: selectedAbout.achievements ?? [],
      paragraphs: selectedAbout.paragraphs ?? [],
      capabilities: selectedAbout.capabilities ?? [],
    });
  }, [selectedAbout]);

  const isMutating = isCreating || isUpdating;

  const handleFieldChange = (
    field: keyof AboutFormValues,
    value: AboutFormValues[keyof AboutFormValues]
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

  const resetForm = () => {
    setSelectedAbout(null);
    setFormValues(createEmptyFormState());
  };

  const getErrorMessage = (error: unknown) => {
    const axiosError = error as AxiosError<{ message?: string }>;
    return (
      axiosError?.response?.data?.message ||
      axiosError?.message ||
      "Алдаа гарлаа."
    );
  };

  const sanitizePayload = (values: AboutFormValues): AboutPayload => ({
    paragraphImage: values.paragraphImage.trim(),
    title: values.title.trim(),
    content: values.content.trim(),
    timeline: values.timeline
      .map((item) => ({
        year: item.year.trim(),
        milestone: item.milestone.trim(),
      }))
      .filter((item) => item.year || item.milestone),
    achievements: values.achievements
      .map((item) => item.trim())
      .filter((item) => item),
    paragraphs: values.paragraphs
      .map((item) => item.trim())
      .filter((item) => item),
    capabilities: values.capabilities
      .map((item) => ({
        title: item.title.trim(),
        description: item.description.trim(),
      }))
      .filter((item) => item.title || item.description),
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = sanitizePayload(formValues);
    const id = extractId(selectedAbout);

    if (id) {
      updateAbout(
        { id, payload },
        {
          onSuccess: () => {
            toast.success("Танилцуулгын бичлэгийг амжилттай шинэчиллээ.");
            resetForm();
          },
          onError: (error) => {
            toast.error(getErrorMessage(error));
          },
        }
      );
      return;
    }

    createAbout(payload, {
      onSuccess: () => {
        toast.success("Танилцуулгын бичлэгийг амжилттай үүсгэлээ.");
        resetForm();
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const handleEdit = (about: AboutEntity) => {
    setSelectedAbout(about);
  };

  const handleDelete = (about: AboutEntity) => {
    const id = extractId(about);
    if (!id) {
      toast.error("Сонгосон бичлэгийг тодорхойлж чадсангүй.");
      return;
    }

    const confirmation = window.confirm(
      "Энэ танилцуулгын бичлэгийг устгахдаа итгэлтэй байна уу?"
    );

    if (!confirmation) return;

    setDeletingId(id);
    deleteAbout(
      { id },
      {
        onSuccess: () => {
          toast.success("Танилцуулгын бичлэгийг амжилттай устгалаа.");
          if (extractId(selectedAbout) === id) {
            resetForm();
          }
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
        onSettled: () => {
          setDeletingId(null);
        },
      }
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1.8fr]">
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Танилцуулгын бичлэгүүд
            </h2>
            <p className="text-sm text-gray-500">
              Олон нийтэд харагдах "Бидний тухай" хуудсан дээрх агуулгыг
              удирдаарай.
            </p>
          </div>
          <Button onClick={resetForm} variant="outline" size="sm">
            Шинээр үүсгэх
          </Button>
        </div>
        <div className="px-5 py-4">
          {isLoading ? (
            <p className="text-sm text-gray-500">
              Бичлэгүүдийг ачаалж байна...
            </p>
          ) : abouts.length === 0 ? (
            <p className="text-sm text-gray-500">
              Одоогоор бичлэг алга. Маягтыг ашиглан шинэ бичлэг үүсгээрэй.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3 font-medium">Гарчиг</th>
                    <th className="px-4 py-3 font-medium">Шинэчлэгдсэн</th>
                    <th className="px-4 py-3 font-medium">Догол мөрүүд</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Үйлдлүүд
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {abouts.map((about, index) => {
                    const id = extractId(about);
                    const isActive = id && extractId(selectedAbout) === id;
                    return (
                      <tr
                        key={id || `${about.title ?? "about"}-${index}`}
                        className={isActive ? "bg-gray-50" : undefined}
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {about.title || "Гарчиггүй"}
                        </td>
                        <td className="px-4 py-3">
                          {about.updatedAt
                            ? new Date(about.updatedAt).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          {about.paragraphs?.length ?? 0}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant={isActive ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleEdit(about)}
                            >
                              Засах
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(about)}
                              disabled={isDeleting && deletingId === id}
                            >
                              Устгах
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {extractId(selectedAbout)
              ? "Танилцуулгын бичлэгийг засах"
              : "Танилцуулгын бичлэг үүсгэх"}
          </h2>
          <p className="text-sm text-gray-500">
            Доорх хэсгүүдийг бөглөж "Бидний тухай" хуудсан дахь агуулгыг
            удирдаарай.
          </p>
        </div>
        <form className="space-y-6 px-5 py-6" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">Гарчиг</label>
            <Input
              placeholder="Бидний тухай"
              value={formValues.title}
              onChange={(event) =>
                handleFieldChange("title", event.target.value)
              }
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
              >
                Үйл явдал нэмэх
              </Button>
            </div>
            {formValues.timeline.length === 0 && (
              <p className="text-sm text-gray-500">
                Одоогоор үйл явдал алга. Эхнийгээ нэмээрэй.
              </p>
            )}
            <div className="space-y-4">
              {formValues.timeline.map((item, index) => (
                <div
                  key={`timeline-${index}`}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="grid gap-3 md:grid-cols-[160px_1fr] md:gap-4">
                    <div className="grid gap-2">
                      <label className="text-xs font-medium text-gray-500">
                        Он
                      </label>
                      <Input
                        placeholder="2024"
                        value={item.year}
                        onChange={(event) =>
                          handleTimelineChange(
                            index,
                            "year",
                            event.target.value
                          )
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-medium text-gray-500">
                        Чухал үйл явдал
                      </label>
                      <Input
                        placeholder="Хоёр дахь салбараа нээлээ"
                        value={item.milestone}
                        onChange={(event) =>
                          handleTimelineChange(
                            index,
                            "milestone",
                            event.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTimelineItem(index)}
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
                  Шагнал, хүлээн зөвшөөрөлт болон гол ололтоо харуулна уу.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => addArrayTextItem("achievements")}
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
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayTextItem("achievements", index)}
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
                  />
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayTextItem("paragraphs", index)}
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
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCapabilityItem(index)}
                    >
                      Арилгах
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={resetForm}
              disabled={isMutating}
            >
              Цуцлах
            </Button>
            <Button type="submit" disabled={isMutating}>
              {extractId(selectedAbout)
                ? "Бичлэгийг шинэчлэх"
                : "Бичлэг үүсгэх"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
