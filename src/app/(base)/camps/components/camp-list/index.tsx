"use client";

import { useMemo } from "react";
import { CalendarDays, Dumbbell, Edit, MapPin, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import type { CampEntity } from "../../model";
import { ImageURL } from "@/lib/authClient";

interface CampListProps {
  camps: CampEntity[];
  isLoading?: boolean;
  onEdit: (camp: CampEntity) => void;
  onDelete: (camp: CampEntity) => void;
  activeCampId?: string | null;
  deletingId?: string | null;
  isDeleting?: boolean;
}

const extractId = (camp: CampEntity) => camp?._id ?? camp?.id ?? "";

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
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

export default function CampList({
  camps,
  isLoading = false,
  onEdit,
  onDelete,
  activeCampId,
  deletingId,
  isDeleting,
}: CampListProps) {
  const showLoadingState = useMemo(
    () => isLoading && (!camps || camps.length === 0),
    [camps, isLoading]
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

  if (!isLoading && camps.length === 0) {
    return (
      <Card className="p-6 text-sm text-gray-500 shadow-2xl">
        Одоогоор зуслангийн мэдээлэл байхгүй байна. &ldquo;Зуслан нэмэх&rdquo;
        товчийг ашиглан шинэчлээрэй.
      </Card>
    );
  }

  return (
    <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 md:gap-4">
      {camps.map((camp) => {
        const id = extractId(camp);
        const isActive = id && activeCampId && id === activeCampId;
        const isCampDeleting = Boolean(isDeleting && deletingId === id);
        const descriptionType = camp.descriptionType ?? "text";
        const descriptionItems =
          descriptionType === "list"
            ? parseDescriptionList(camp.description)
            : [];
        const dateLabel = formatDateRange(camp.date, camp.endDate);

        return (
          <Card
            key={id || camp.title || camp.description}
            className={`border ${
              isActive ? "border-primary" : "border-transparent"
            } p-6 shadow-2xl transition-shadow`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900 break-words">
                    {camp.title || "Гарчиггүй зуслан"}
                  </h3>
                  {camp.sport && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      <Dumbbell className="h-3.5 w-3.5" />
                      {camp.sport}
                    </span>
                  )}
                  {dateLabel && dateLabel !== "—" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {dateLabel}
                    </span>
                  )}
                </div>
                {camp.location && (
                  <p className="flex items-start gap-1 text-sm text-gray-600">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="min-w-0 break-words">{camp.location}</span>
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
                ) : camp.description ? (
                  <p className="max-h-24 overflow-hidden text-sm leading-relaxed text-gray-600 break-words whitespace-pre-line">
                    {camp.description}
                  </p>
                ) : null}
                {camp.image && (
                  <div className="w-full overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                    <img
                      src={ImageURL + camp.image}
                      alt={camp.title || "Зуслангийн зураг"}
                      className="w-full object-cover bg-red-300 "
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onEdit(camp)}
              >
                <Edit className="mr-2 h-4 w-4" /> Засах
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(camp)}
                disabled={isCampDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isCampDeleting ? "Устгаж байна..." : "Устгах"}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
