"use client";

import { useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { Medal } from "lucide-react";

import ButtonWithAdornment from "@/components/form-elements/button-with-adornment";

import CompetitionDialog from "./components/competition-dialog";
import CompetitionList from "./components/competition-list";
import {
  useCreateCompetition,
  useDeleteCompetition,
  useGetCompetitions,
  useUpdateCompetition,
} from "./hook";
import type {
  CompetitionEntity,
  CompetitionPayload,
  CompetitionType,
} from "./model";

const normalizeCompetitions = (payload: unknown): CompetitionEntity[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload as CompetitionEntity[];
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: CompetitionEntity[] }).data;
  }

  return [];
};

const extractId = (competition: CompetitionEntity | null) =>
  competition?._id ?? competition?.id ?? "";

const normalizeCompetitionType = (
  value: CompetitionPayload["type"] | string | null | undefined
): CompetitionType => {
  return value === "pastEvents" ? "pastEvents" : "upcomingEvents";
};

const sanitizePayload = (values: CompetitionPayload): CompetitionPayload => ({
  title: values.title.trim(),
  sport: values.sport.trim(),
  date: values.date ? new Date(values.date).toISOString() : "",
  location: values.location.trim(),
  description: values.description.trim(),
  image: values.image.trim(),
  type: normalizeCompetitionType(values.type),
  link: values.link.trim(),
});

const getErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return (
    axiosError?.response?.data?.message ||
    axiosError?.message ||
    "Алдаа гарлаа."
  );
};

export default function CompetitionPage() {
  const { data, isLoading } = useGetCompetitions();
  const { mutate: createCompetition, isPending: isCreating } =
    useCreateCompetition();
  const { mutate: updateCompetition, isPending: isUpdating } =
    useUpdateCompetition();
  const { mutate: deleteCompetition, isPending: isDeleting } =
    useDeleteCompetition();

  const competitions = useMemo(() => normalizeCompetitions(data), [data]);

  const [open, setOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] =
    useState<CompetitionEntity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isSubmitting = isCreating || isUpdating;

  const handleCreateClick = () => {
    setSelectedCompetition(null);
    setOpen(true);
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelectedCompetition(null);
    }
  };

  const handleSubmit = (values: CompetitionPayload) => {
    const payload = sanitizePayload(values);
    const id = extractId(selectedCompetition);

    if (id) {
      updateCompetition(
        { id, payload },
        {
          onSuccess: () => {
            toast.success("Тэмцээний мэдээллийг амжилттай шинэчиллээ.");
            setSelectedCompetition(null);
            setOpen(false);
          },
          onError: (error) => {
            toast.error(getErrorMessage(error));
          },
        }
      );
      return;
    }

    createCompetition(payload, {
      onSuccess: () => {
        toast.success("Тэмцээний мэдээллийг амжилттай үүсгэлээ.");
        setSelectedCompetition(null);
        setOpen(false);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const handleEdit = (competition: CompetitionEntity) => {
    setSelectedCompetition(competition);
    setOpen(true);
  };

  const handleDelete = (competition: CompetitionEntity) => {
    const id = extractId(competition);
    if (!id) {
      toast.error("Устгах тэмцээний мэдээллийг тодорхойлж чадсангүй.");
      return;
    }

    const confirmation = window.confirm("Энэ тэмцээний мэдээллийг устгах уу?");

    if (!confirmation) return;

    setDeletingId(id);
    deleteCompetition(
      { id },
      {
        onSuccess: () => {
          toast.success("Тэмцээний мэдээллийг амжилттай устгалаа.");
          if (extractId(selectedCompetition) === id) {
            setSelectedCompetition(null);
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
          label="Тэмцээн нэмэх"
          onClick={handleCreateClick}
          startAdornment={<Medal className="h-4 w-4" />}
        />
      </div>
      <CompetitionList
        competitions={competitions}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        activeCompetitionId={extractId(selectedCompetition)}
        deletingId={deletingId}
        isDeleting={isDeleting}
      />
      <CompetitionDialog
        onOpenChange={handleDialogOpenChange}
        open={open}
        initialValues={selectedCompetition}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        mode={selectedCompetition ? "edit" : "create"}
      />
    </main>
  );
}
