"use client";

import { useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { FilePlus2 } from "lucide-react";

import ButtonWithAdornment from "@/components/form-elements/button-with-adornment";

import AboutDialog from "./components/about-dialog";
import AboutList from "./components/about-list";
import {
  type AboutEntity,
  type AboutPayload,
  useCreateAbout,
  useDeleteAbout,
  useGetAbout,
  useUpdateAbout,
} from "./hook";

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

const getErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return (
    axiosError?.response?.data?.message ||
    axiosError?.message ||
    "Алдаа гарлаа."
  );
};

const sanitizePayload = (values: AboutPayload): AboutPayload => ({
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

export default function AboutPage() {
  const { data, isLoading } = useGetAbout();
  const { mutate: createAbout, isPending: isCreating } = useCreateAbout();
  const { mutate: updateAbout, isPending: isUpdating } = useUpdateAbout();
  const { mutate: deleteAbout, isPending: isDeleting } = useDeleteAbout();

  const abouts = useMemo(() => normalizeAbouts(data), [data]);

  const [open, setOpen] = useState(false);
  const [selectedAbout, setSelectedAbout] = useState<AboutEntity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isSubmitting = isCreating || isUpdating;

  const handleCreateClick = () => {
    setSelectedAbout(null);
    setOpen(true);
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelectedAbout(null);
    }
  };

  const handleSubmit = (values: AboutPayload) => {
    const payload = sanitizePayload(values);
    const id = extractId(selectedAbout);

    if (id) {
      updateAbout(
        { id, payload },
        {
          onSuccess: () => {
            toast.success("Танилцуулгын бичлэгийг амжилттай шинэчиллээ.");
            setSelectedAbout(null);
            setOpen(false);
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
        setSelectedAbout(null);
        setOpen(false);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const handleEdit = (about: AboutEntity) => {
    setSelectedAbout(about);
    setOpen(true);
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
            setSelectedAbout(null);
            setOpen(false);
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
    <main className="space-y-6">
      <div className="flex justify-end">
        <ButtonWithAdornment
          label="Танилцуулга үүсгэх"
          onClick={handleCreateClick}
          startAdornment={<FilePlus2 className="h-4 w-4" />}
        />
      </div>
      <AboutList
        abouts={abouts}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        activeAboutId={extractId(selectedAbout)}
        deletingId={deletingId}
        isDeleting={isDeleting}
      />
      <AboutDialog
        open={open}
        onOpenChange={handleDialogOpenChange}
        initialValues={selectedAbout}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        mode={selectedAbout ? "edit" : "create"}
      />
    </main>
  );
}
