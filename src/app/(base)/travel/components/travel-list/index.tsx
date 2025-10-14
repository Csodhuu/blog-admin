"use client";

import { useMemo } from "react";
import { CalendarDays, Edit, PlaneTakeoff, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import type { TravelEntity } from "../../model";

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
        You haven&apos;t created any travel experiences yet. Click the &quot;Create travel&quot;
        button to get started.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
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
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {travel.title || "Untitled travel"}
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
                  <p className="text-sm text-gray-600">{travel.description}</p>
                )}
                {travel.image && (
                  <p className="text-xs text-gray-500">
                    Image:{' '}
                    <a
                      href={travel.image}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline"
                    >
                      {travel.image}
                    </a>
                  </p>
                )}
              </div>

              <div className="flex shrink-0 gap-2">
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onEdit(travel)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(travel)}
                  disabled={isTravelDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isTravelDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
