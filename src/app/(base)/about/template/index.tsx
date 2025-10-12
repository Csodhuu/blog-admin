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

const extractId = (about: AboutEntity | null) =>
  about?._id ?? about?.id ?? "";

export default function AboutClient() {
  const { data, isLoading } = useGetAbout();
  const { mutate: createAbout, isPending: isCreating } = useCreateAbout();
  const { mutate: updateAbout, isPending: isUpdating } = useUpdateAbout();
  const { mutate: deleteAbout, isPending: isDeleting } = useDeleteAbout();

  const abouts = useMemo(() => normalizeAbouts(data), [data]);

  const [selectedAbout, setSelectedAbout] = useState<AboutEntity | null>(null);
  const [formValues, setFormValues] = useState<AboutFormValues>(
    createEmptyFormState(),
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
    value: AboutFormValues[keyof AboutFormValues],
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTimelineChange = (
    index: number,
    key: "year" | "milestone",
    value: string,
  ) => {
    setFormValues((prev) => ({
      ...prev,
      timeline: prev.timeline.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const handleCapabilityChange = (
    index: number,
    key: "title" | "description",
    value: string,
  ) => {
    setFormValues((prev) => ({
      ...prev,
      capabilities: prev.capabilities.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const handleArrayTextChange = (
    field: "achievements" | "paragraphs",
    index: number,
    value: string,
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: prev[field].map((item, itemIndex) =>
        itemIndex === index ? value : item,
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
      capabilities: prev.capabilities.filter((_, itemIndex) => itemIndex !== index),
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
    index: number,
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
      "Something went wrong."
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
            toast.success("About entry updated successfully.");
            resetForm();
          },
          onError: (error) => {
            toast.error(getErrorMessage(error));
          },
        },
      );
      return;
    }

    createAbout(payload, {
      onSuccess: () => {
        toast.success("About entry created successfully.");
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
      toast.error("Unable to determine the selected entry.");
      return;
    }

    const confirmation = window.confirm(
      "Are you sure you want to delete this about entry?",
    );

    if (!confirmation) return;

    setDeletingId(id);
    deleteAbout(
      { id },
      {
        onSuccess: () => {
          toast.success("About entry deleted successfully.");
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
      },
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1.8fr]">
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              About entries
            </h2>
            <p className="text-sm text-gray-500">
              Manage the content displayed on the public About page.
            </p>
          </div>
          <Button onClick={resetForm} variant="outline" size="sm">
            Create new
          </Button>
        </div>
        <div className="px-5 py-4">
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading entries...</p>
          ) : abouts.length === 0 ? (
            <p className="text-sm text-gray-500">
              No entries yet. Start by creating one using the form.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Updated</th>
                    <th className="px-4 py-3 font-medium">Paragraphs</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
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
                          {about.title || "Untitled"}
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
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(about)}
                              disabled={isDeleting && deletingId === id}
                            >
                              Delete
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
            {extractId(selectedAbout) ? "Edit about entry" : "Create about entry"}
          </h2>
          <p className="text-sm text-gray-500">
            Fill out the sections below to control the content on your About
            page.
          </p>
        </div>
        <form className="space-y-6 px-5 py-6" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">
              Title
            </label>
            <Input
              placeholder="About us"
              value={formValues.title}
              onChange={(event) => handleFieldChange("title", event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">
              Hero image URL
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
              Intro content
            </label>
            <Textarea
              placeholder="Share your story, values, and mission."
              value={formValues.content}
              onChange={(event) => handleFieldChange("content", event.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Timeline
                </h3>
                <p className="text-xs text-gray-500">
                  Highlight important milestones across the years.
                </p>
              </div>
              <Button type="button" size="sm" variant="outline" onClick={addTimelineItem}>
                Add milestone
              </Button>
            </div>
            {formValues.timeline.length === 0 && (
              <p className="text-sm text-gray-500">
                No milestones yet. Add your first one.
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
                        Year
                      </label>
                      <Input
                        placeholder="2024"
                        value={item.year}
                        onChange={(event) =>
                          handleTimelineChange(index, "year", event.target.value)
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-medium text-gray-500">
                        Milestone
                      </label>
                      <Input
                        placeholder="Opened our second office"
                        value={item.milestone}
                        onChange={(event) =>
                          handleTimelineChange(
                            index,
                            "milestone",
                            event.target.value,
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
                      Remove
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
                  Achievements
                </h3>
                <p className="text-xs text-gray-500">
                  Showcase awards, recognitions, or key accomplishments.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => addArrayTextItem("achievements")}
              >
                Add achievement
              </Button>
            </div>
            {formValues.achievements.length === 0 && (
              <p className="text-sm text-gray-500">
                No achievements added yet.
              </p>
            )}
            <div className="space-y-3">
              {formValues.achievements.map((achievement, index) => (
                <div key={`achievement-${index}`} className="flex gap-3">
                  <Input
                    placeholder="Best startup award 2023"
                    value={achievement}
                    onChange={(event) =>
                      handleArrayTextChange(
                        "achievements",
                        index,
                        event.target.value,
                      )
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayTextItem("achievements", index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Paragraphs</h3>
                <p className="text-xs text-gray-500">
                  Break down your story into digestible sections.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => addArrayTextItem("paragraphs")}
              >
                Add paragraph
              </Button>
            </div>
            {formValues.paragraphs.length === 0 && (
              <p className="text-sm text-gray-500">
                No paragraphs added yet.
              </p>
            )}
            <div className="space-y-3">
              {formValues.paragraphs.map((paragraph, index) => (
                <div key={`paragraph-${index}`} className="space-y-2">
                  <Textarea
                    placeholder="We started as a small team with a big vision..."
                    value={paragraph}
                    onChange={(event) =>
                      handleArrayTextChange(
                        "paragraphs",
                        index,
                        event.target.value,
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
                      Remove
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
                  Capabilities
                </h3>
                <p className="text-xs text-gray-500">
                  List the services or skills that define your organisation.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addCapabilityItem}
              >
                Add capability
              </Button>
            </div>
            {formValues.capabilities.length === 0 && (
              <p className="text-sm text-gray-500">
                No capabilities added yet.
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
                        Title
                      </label>
                      <Input
                        placeholder="Consulting"
                        value={capability.title}
                        onChange={(event) =>
                          handleCapabilityChange(
                            index,
                            "title",
                            event.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-medium text-gray-500">
                        Description
                      </label>
                      <Textarea
                        placeholder="We help teams navigate complex digital transformations."
                        value={capability.description}
                        onChange={(event) =>
                          handleCapabilityChange(
                            index,
                            "description",
                            event.target.value,
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
                      Remove
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
              Cancel
            </Button>
            <Button type="submit" disabled={isMutating}>
              {extractId(selectedAbout) ? "Update entry" : "Create entry"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
