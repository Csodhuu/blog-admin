"use client";

import { useMemo } from "react";
import { CalendarDays, Dumbbell, Edit, MapPin, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import type { CampEntity } from "../../model";

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
        You haven&apos;t created any camps yet. Click the &quot;Create camp&quot; button to
        get started.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {camps.map((camp) => {
        const id = extractId(camp);
        const isActive = id && activeCampId && id === activeCampId;
        const isCampDeleting = Boolean(isDeleting && deletingId === id);

        return (
          <Card
            key={id || camp.title || camp.description}
            className={`border ${
              isActive ? "border-primary" : "border-transparent"
            } p-6 shadow-2xl transition-shadow`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {camp.title || "Untitled camp"}
                  </h3>
                  {camp.sport && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      <Dumbbell className="h-3.5 w-3.5" />
                      {camp.sport}
                    </span>
                  )}
                  {camp.date && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(camp.date)}
                    </span>
                  )}
                </div>
                {camp.location && (
                  <p className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {camp.location}
                  </p>
                )}
                {camp.description && (
                  <p className="text-sm text-gray-600">{camp.description}</p>
                )}
                {camp.image && (
                  <p className="text-xs text-gray-500">
                    Image:{' '}
                    <a
                      href={camp.image}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline"
                    >
                      {camp.image}
                    </a>
                  </p>
                )}
              </div>

              <div className="flex shrink-0 gap-2">
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onEdit(camp)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(camp)}
                  disabled={isCampDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isCampDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
