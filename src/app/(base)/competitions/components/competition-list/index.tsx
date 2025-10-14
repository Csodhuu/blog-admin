"use client";

import { useMemo } from "react";
import {
  CalendarDays,
  MapPin,
  Medal,
  Trophy,
  Edit,
  Trash2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import type { CompetitionEntity, CompetitionType } from "../../model";

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
      return "Upcoming";
    case "pastEvents":
      return "Past";
    default:
      return null;
  }
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
        You haven&apos;t created any competitions yet. Click the &quot;Create
        competition&quot; button to get started.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {competitions.map((competition) => {
        const id = extractId(competition);
        const isActive = id && activeCompetitionId && id === activeCompetitionId;
        const isCompetitionDeleting = Boolean(isDeleting && deletingId === id);
        const typeLabel = getTypeLabel(competition.type);

        return (
          <Card
            key={id || competition.title || competition.description}
            className={`border ${
              isActive ? "border-primary" : "border-transparent"
            } p-6 shadow-2xl transition-shadow`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {competition.title || "Untitled competition"}
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
                  {competition.date && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(competition.date)}
                    </span>
                  )}
                </div>
                {competition.location && (
                  <p className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {competition.location}
                  </p>
                )}
                {competition.description && (
                  <p className="text-sm text-gray-600">{competition.description}</p>
                )}
                {competition.image && (
                  <p className="text-xs text-gray-500">
                    Image:{" "}
                    <a
                      href={competition.image}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline"
                    >
                      {competition.image}
                    </a>
                  </p>
                )}
              </div>

              <div className="flex shrink-0 gap-2">
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onEdit(competition)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(competition)}
                  disabled={isCompetitionDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isCompetitionDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
