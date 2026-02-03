"use client";

import { useMemo } from "react";
import { CalendarDays, Edit, PlaneTakeoff, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import type { TravelEntity } from "../../model";
import { ImageURL } from "@/lib/authClient";

interface TravelListProps {
  travels: TravelEntity[];
  isLoading?: boolean;
  onEdit: (travel: TravelEntity) => void;
  onDelete: (travel: TravelEntity) => void;
  activeTravelId?: string | null;
  deletingId?: string | null;
  isDeleting?: boolean;
}

const extractId = (travel: TravelEntity) => travel?._id ?? travel?.id ?? "";

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
};

export default function TravelList({
  travels,
  isLoading = false,
  onEdit,
  onDelete,
  activeTravelId,
  deletingId,
  isDeleting,
}: TravelListProps) {
  const showLoadingState = useMemo(
    () => isLoading && (!travels || travels.length === 0),
    [isLoading, travels]
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

  if (!isLoading && travels.length === 0) {
    return (
      <Card className="p-6 text-sm text-gray-500 shadow-2xl">
        Одоогоор аяллын мэдээлэл нэмэгдээгүй байна. &ldquo;Аялал нэмэх&rdquo;
        товчийг дарж эхлээрэй.
      </Card>
    );
  }

  return (
    <div className="space-y-4 grid grid-cols-3 ">
      {travels.map((travel) => {
        const id = extractId(travel);
        const isActive = id && activeTravelId && id === activeTravelId;
        const isTravelDeleting = Boolean(isDeleting && deletingId === id);

        return (
          <Card
            key={id || travel.title || travel.description}
            className={`border ${
              isActive ? "border-primary" : "border-transparent"
            } p-6 shadow-2xl transition-shadow`}
          >
            <div className="flex flex-col gap-4 ">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900 break-words">
                    {travel.title || "Гарчиггүй аялал"}
                  </h3>
                  {travel.destination && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      <PlaneTakeoff className="h-3.5 w-3.5" />
                      {travel.destination}
                    </span>
                  )}
                  {travel.date && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(travel.date)}
                    </span>
                  )}
                </div>
                {travel.description && (
                  <p className="max-h-24 overflow-hidden text-sm leading-relaxed text-gray-600 break-words whitespace-pre-line">
                    {travel.description}
                  </p>
                )}
                {travel.image && (
                  <div className="w-full overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                    <img
                      src={ImageURL + travel.image}
                      alt={travel.title || "Аяллын зураг"}
                      className="h-48 w-full object-cover sm:h-56"
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
                onClick={() => onEdit(travel)}
              >
                <Edit className="mr-2 h-4 w-4" /> Засах
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(travel)}
                disabled={isTravelDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isTravelDeleting ? "Устгаж байна..." : "Устгах"}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
