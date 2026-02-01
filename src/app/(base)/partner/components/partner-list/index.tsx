"use client";

import { useMemo } from "react";
import { Edit, Image, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import type { PartnerEntity } from "../../model";

interface PartnerListProps {
  partners: PartnerEntity[];
  isLoading?: boolean;
  onEdit: (partner: PartnerEntity) => void;
  onDelete: (partner: PartnerEntity) => void;
  activePartnerId?: string | null;
  deletingId?: string | null;
  isDeleting?: boolean;
}

const extractId = (partner: PartnerEntity) =>
  partner?._id ?? partner?._id ?? "";

export default function PartnerList({
  partners,
  isLoading = false,
  onEdit,
  onDelete,
  activePartnerId,
  deletingId,
  isDeleting,
}: PartnerListProps) {
  const showLoadingState = useMemo(
    () => isLoading && (!partners || partners.length === 0),
    [partners, isLoading]
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

  if (!isLoading && partners.length === 0) {
    return (
      <Card className="p-6 text-sm text-gray-500 shadow-2xl">
        Одоогоор хамтрагч байгууллагын мэдээлэл нэмэгдээгүй байна.
        &ldquo;Хамтрагч байгууллага нэмэх&rdquo; товчийг дарж эхлээрэй.
      </Card>
    );
  }

  return (
    <div className=" grid grid-cols-5 gap-5 ">
      {partners.map((partner) => {
        const id = extractId(partner);
        const isActive = id && activePartnerId && id === activePartnerId;
        const isPartnerDeleting = Boolean(isDeleting && deletingId === id);

        return (
          <Card
            key={id || partner.name}
            className={`border ${
              isActive ? "border-primary" : "border-transparent"
            } p-6 shadow-2xl transition-shadow`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2 flex flex-col justify-center items-center w-full ">
                <h3 className="text-xl font-semibold text-gray-900">
                  {partner.name || "Нэргүй хамтрагч"}
                </h3>
                {partner.image ? (
                  <p className="flex items-center gap-1 text-sm text-gray-600">
                    <img src={partner.image} alt={partner.name} width={100} />
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Лого оруулаагүй байна.
                  </p>
                )}
              </div>
            </div>
            <div className="flex  justify-center shrink-0 gap-2">
              <Button
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onEdit(partner)}
              >
                <Edit className="mr-2 h-4 w-4" /> Засах
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(partner)}
                disabled={isPartnerDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isPartnerDeleting ? "Устгаж байна..." : "Устгах"}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
