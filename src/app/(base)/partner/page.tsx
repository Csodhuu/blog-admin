"use client";

import { useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { Handshake } from "lucide-react";

import ButtonWithAdornment from "@/components/form-elements/button-with-adornment";

import PartnerDialog from "./components/create-partner-dialog";
import PartnerList from "./components/partner-list";
import {
  useCreatePartner,
  useDeletePartner,
  useGetPartners,
  useUpdatePartner,
} from "./hooks";
import type { PartnerEntity, PartnerPayload } from "./model";

const normalizePartners = (payload: unknown): PartnerEntity[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload as PartnerEntity[];
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: PartnerEntity[] }).data;
  }

  return [];
};

const extractId = (partner: PartnerEntity | null) =>
  partner?._id ?? partner?._id ?? "";

const sanitizePayload = (values: PartnerPayload): PartnerPayload => ({
  name: values.name.trim(),
  image: values.image.trim(),
});

const getErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return (
    axiosError?.response?.data?.message ||
    axiosError?.message ||
    "Алдаа гарлаа."
  );
};

export default function PartnerPage() {
  const { data, isLoading } = useGetPartners();
  const { mutate: createPartner, isPending: isCreating } = useCreatePartner();
  const { mutate: updatePartner, isPending: isUpdating } = useUpdatePartner();
  const { mutate: deletePartner, isPending: isDeleting } = useDeletePartner();

  const partners = useMemo(() => normalizePartners(data), [data]);

  const [open, setOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<PartnerEntity | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isSubmitting = isCreating || isUpdating;

  const handleCreateClick = () => {
    setSelectedPartner(null);
    setOpen(true);
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelectedPartner(null);
    }
  };

  const handleSubmit = (values: PartnerPayload) => {
    const payload = sanitizePayload(values);
    const id = extractId(selectedPartner);

    if (id) {
      updatePartner(
        { id, payload },
        {
          onSuccess: () => {
            toast.success(
              "Хамтрагч байгууллагын мэдээллийг амжилттай шинэчиллээ."
            );
            setSelectedPartner(null);
            setOpen(false);
          },
          onError: (error) => {
            toast.error(getErrorMessage(error));
          },
        }
      );
      return;
    }

    createPartner(payload, {
      onSuccess: () => {
        toast.success("Хамтрагч байгууллагын мэдээллийг амжилттай үүсгэлээ.");
        setSelectedPartner(null);
        setOpen(false);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const handleEdit = (partner: PartnerEntity) => {
    setSelectedPartner(partner);
    setOpen(true);
  };

  const handleDelete = (partner: PartnerEntity) => {
    const id = extractId(partner);
    if (!id) {
      toast.error(
        "Устгах хамтрагч байгууллагын мэдээллийг тодорхойлж чадсангүй."
      );
      return;
    }

    const confirmation = window.confirm(
      "Энэ хамтрагч байгууллагын мэдээллийг устгах уу?"
    );

    if (!confirmation) return;

    setDeletingId(id);
    deletePartner(
      { id },
      {
        onSuccess: () => {
          toast.success("Хамтрагч байгууллагын мэдээллийг амжилттай устгалаа.");
          if (extractId(selectedPartner) === id) {
            setSelectedPartner(null);
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
          label="Хамтрагч байгууллага нэмэх"
          onClick={handleCreateClick}
          startAdornment={<Handshake className="h-4 w-4" />}
        />
      </div>
      <PartnerList
        partners={partners}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        activePartnerId={extractId(selectedPartner)}
        deletingId={deletingId}
        isDeleting={isDeleting}
      />
      <PartnerDialog
        onOpenChange={handleDialogOpenChange}
        open={open}
        initialValues={selectedPartner}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        mode={selectedPartner ? "edit" : "create"}
      />
    </main>
  );
}
