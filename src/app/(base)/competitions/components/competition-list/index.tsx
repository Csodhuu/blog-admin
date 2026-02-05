"use client";

import { useMemo } from "react";
import {
  CalendarDays,
  MapPin,
  Medal,
  Trophy,
  Edit,
  Trash2,
  ExternalLink,
  FileText,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import type { CompetitionEntity, CompetitionType } from "../../model";
import { ImageURL } from "@/lib/authClient";

interface CompetitionListProps {
  competitions: CompetitionEntity[];
  isLoading?: boolean;
  onEdit: (competition: CompetitionEntity) => void;
  onDelete: (competition: CompetitionEntity) => void;
  activeCompetitionId?: string | null;
  deletingId?: string | null;
  isDeleting?: boolean;
}

const extractId = (competition: CompetitionEntity) =>
  competition?._id ?? competition?.id ?? "";

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
};

const getTypeLabel = (type?: CompetitionType | null) => {
  switch (type) {
    case "upcomingEvents":
      return "Удахгүй";
    case "pastEvents":
      return "Өнгөрсөн";
    default:
      return null;
  }
};

const formatDateRange = (start?: string | null, end?: string | null) => {
  const startDate = formatDate(start);
  const endDate = formatDate(end);

  if (startDate === "—" && endDate === "—") return "—";
  if (startDate !== "—" && endDate !== "—") return `${startDate} - ${endDate}`;
  return startDate !== "—" ? startDate : endDate;
};

const parseDescriptionList = (raw?: string | null) => {
  const value = (raw ?? "").trim();
  if (!value) return [];

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*•]\s+/, ""));
};

const resolveImageSrc = (image?: string | null) => {
  if (!image) return null;
  const trimmed = image.trim();

  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const base = ImageURL.replace(/\/$/, "");
  const path = trimmed.replace(/^\//, "");

  return `${base}/${path}`;
};

export default function CompetitionList({
  competitions,
  isLoading = false,
  onEdit,
  onDelete,
  activeCompetitionId,
  deletingId,
  isDeleting,
}: CompetitionListProps) {
  const showLoadingState = useMemo(
    () => isLoading && (!competitions || competitions.length === 0),
    [competitions, isLoading]
  );

  if (showLoadingState) {
    return (
      <Card className="p-6 shadow-2xl">
        <div className="space-y-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Card>
    );
  }

  if (!isLoading && competitions.length === 0) {
    return (
      <Card className="p-6 text-sm text-gray-500 shadow-2xl">
        Одоогоор тэмцээний мэдээлэл нэмэгдээгүй байна. &ldquo;Тэмцээн
        нэмэх&rdquo; товчийг дарж эхлээрэй.
      </Card>
    );
  }

  return (
    <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {competitions.map((competition) => {
        const id = extractId(competition);
        const isActive =
          id && activeCompetitionId && id === activeCompetitionId;
        const isCompetitionDeleting = Boolean(isDeleting && deletingId === id);
        const typeLabel = getTypeLabel(competition.type);
        const descriptionType = competition.descriptionType ?? "text";
        const descriptionItems =
          descriptionType === "list"
            ? parseDescriptionList(competition.description)
            : [];
        const imageSrc = resolveImageSrc(competition.image);
        const dateLabel = formatDateRange(
          competition.date,
          competition.endDate
        );

        return (
          <Card
            key={id || competition.title || competition.description}
            className={`border ${
              isActive ? "border-primary" : "border-transparent"
            } p-6 shadow-2xl transition-shadow`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900 break-words">
                    {competition.title || "Гарчиггүй тэмцээн"}
                  </h3>
                  {competition.sport && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      <Trophy className="h-3.5 w-3.5" />
                      {competition.sport}
                    </span>
                  )}
                  {typeLabel && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      <Medal className="h-3.5 w-3.5" />
                      {typeLabel}
                    </span>
                  )}
                  {dateLabel && dateLabel !== "—" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {dateLabel}
                    </span>
                  )}
                </div>

                {competition.location && (
                  <p className="flex items-start gap-1 text-sm text-gray-600">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="min-w-0 break-words">
                      {competition.location}
                    </span>
                  </p>
                )}

                {descriptionType === "list" ? (
                  descriptionItems.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm leading-relaxed text-gray-700 space-y-1 max-h-32 overflow-auto">
                      {descriptionItems.map((item, idx) => (
                        <li key={`${id}-desc-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Тайлбарын жагсаалт байхгүй.
                    </p>
                  )
                ) : competition.description ? (
                  <p className="max-h-24 overflow-hidden text-sm leading-relaxed text-gray-600 break-words whitespace-pre-line">
                    {competition.description}
                  </p>
                ) : null}

                {competition.link && (
                  <Button variant="secondary" size="sm" asChild>
                    <a
                      href={competition.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Баримт / линк
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>

              {imageSrc && (
                <div className="w-full lg:w-48 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                  <img
                    src={imageSrc}
                    alt={competition.title || "Тэмцээний зураг"}
                    className="h-48 w-full object-cover sm:h-56"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onEdit(competition)}
              >
                <Edit className="mr-2 h-4 w-4" /> Засах
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(competition)}
                disabled={isCompetitionDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isCompetitionDeleting ? "Устгаж байна..." : "Устгах"}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
