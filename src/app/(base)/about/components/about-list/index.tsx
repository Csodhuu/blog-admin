"use client";

import { useMemo } from "react";
import {
  CalendarClock,
  FileText,
  Layers,
  ListChecks,
  PanelsTopLeft,
  Trash2,
  Pencil,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import type { AboutEntity } from "../../hook";

interface AboutListProps {
  abouts: AboutEntity[];
  isLoading?: boolean;
  onEdit: (about: AboutEntity) => void;
  onDelete: (about: AboutEntity) => void;
  activeAboutId?: string | null;
  deletingId?: string | null;
  isDeleting?: boolean;
}

const extractId = (about: AboutEntity) => about?._id ?? about?.id ?? "";

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
};

export default function AboutList({
  abouts,
  isLoading = false,
  onEdit,
  onDelete,
  activeAboutId,
  deletingId,
  isDeleting,
}: AboutListProps) {
  const showLoadingState = useMemo(
    () => isLoading && (!abouts || abouts.length === 0),
    [abouts, isLoading]
  );

  if (showLoadingState) {
    return (
      <Card className="p-6 shadow-2xl">
        <div className="space-y-4">
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Card>
    );
  }

  if (!isLoading && abouts.length === 0) {
    return (
      <Card className="p-6 text-sm text-gray-500 shadow-2xl">
        Одоогоор танилцуулгын бичлэг алга. &ldquo;Танилцуулга үүсгэх&rdquo; товчийг дарж
        эхлээрэй.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {abouts.map((about) => {
        const id = extractId(about);
        const isActive = id && activeAboutId && id === activeAboutId;
        const isAboutDeleting = Boolean(isDeleting && deletingId === id);

        return (
          <Card
            key={id || about.title || about.content}
            className={`border ${
              isActive ? "border-primary" : "border-transparent"
            } p-6 shadow-2xl transition-shadow`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {about.title || "Гарчиггүй танилцуулга"}
                  </h3>
                  {about.updatedAt && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      <CalendarClock className="h-3.5 w-3.5" />
                      Шинэчлэгдсэн: {formatDate(about.updatedAt)}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    <FileText className="h-3.5 w-3.5" />
                    Догол мөр: {about.paragraphs?.length ?? 0}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary/20 px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                    <ListChecks className="h-3.5 w-3.5" />
                    Амжилт: {about.achievements?.length ?? 0}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    <PanelsTopLeft className="h-3.5 w-3.5" />
                    Үйл явдал: {about.timeline?.length ?? 0}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                    <Layers className="h-3.5 w-3.5" />
                    Чадвар: {about.capabilities?.length ?? 0}
                  </span>
                </div>

                {about.content && (
                  <p className="text-sm text-gray-600">
                    {about.content.length > 180
                      ? `${about.content.slice(0, 180)}...`
                      : about.content}
                  </p>
                )}

                {about.paragraphImage && (
                  <p className="text-xs text-gray-500">
                    Зураг: {" "}
                    <a
                      href={about.paragraphImage}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline"
                    >
                      {about.paragraphImage}
                    </a>
                  </p>
                )}
              </div>

              <div className="flex shrink-0 gap-2">
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onEdit(about)}
                >
                  <Pencil className="mr-2 h-4 w-4" /> Засах
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(about)}
                  disabled={isAboutDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isAboutDeleting ? "Устгаж байна..." : "Устгах"}
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
