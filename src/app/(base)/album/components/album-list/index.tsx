"use client";

import { useMemo } from "react";
import { CalendarDays, Edit, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import type { AlbumEntity } from "../../model";
import { ImageURL } from "@/lib/authClient";

interface AlbumListProps {
  albums: AlbumEntity[];
  isLoading?: boolean;
  onEdit: (album: AlbumEntity) => void;
  onDelete: (album: AlbumEntity) => void;
  activeAlbumId?: string | null;
  deletingId?: string | null;
  isDeleting?: boolean;
}

const extractId = (album: AlbumEntity) => album?._id ?? album?.id ?? "";

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
};

export default function AlbumList({
  albums,
  isLoading = false,
  onEdit,
  onDelete,
  activeAlbumId,
  deletingId,
  isDeleting,
}: AlbumListProps) {
  const showLoadingState = useMemo(
    () => isLoading && (!albums || albums.length === 0),
    [albums, isLoading]
  );

  if (showLoadingState) {
    return (
      <Card className="p-6 shadow-2xl">
        <div className="space-y-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Card>
    );
  }

  if (!isLoading && albums.length === 0) {
    return (
      <Card className="p-6 text-sm text-gray-500 shadow-2xl">
        Одоогоор зургийн цомог байхгүй байна. &ldquo;Зургийн цомог нэмэх&rdquo;
        товчийг ашиглан шинээр үүсгэнэ үү.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {albums.map((album) => {
        const id = extractId(album);
        const isActive = id && activeAlbumId && id === activeAlbumId;
        const isAlbumDeleting = Boolean(isDeleting && deletingId === id);

        return (
          <Card
            key={id || album.title || album.description}
            className={`border ${
              isActive ? "border-primary" : "border-transparent"
            } p-6 shadow-2xl transition-shadow`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900 break-words">
                    {album.title || "Гарчиггүй цомог"}
                  </h3>
                  {album.year && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(album.year)}
                    </span>
                  )}
                </div>
                {album.description && (
                  <p className="max-h-24 overflow-hidden text-sm leading-relaxed text-gray-600 break-words whitespace-pre-line">
                    {album.description}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 gap-2">
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onEdit(album)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Засах
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(album)}
                  disabled={isAlbumDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isAlbumDeleting ? "Устгаж байна..." : "Устгах"}
                </Button>
              </div>
            </div>

            {Array.isArray(album.albums) && album.albums.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {album.albums.map((item, index) => (
                  <div
                    key={`${id || "album"}-item-${index}`}
                    className="overflow-hidden rounded-lg border border-gray-100 bg-white"
                  >
                    {item?.cover ? (
                      <img
                        src={ImageURL + item.cover}
                        alt="Цомгийн зураг"
                        className="h-40 w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center text-xs text-gray-400">
                        Зураг алга
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
