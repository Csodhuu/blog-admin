"use client";

import { useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import ButtonWithAdornment from "@/components/form-elements/button-with-adornment";

import ContactDialog from "./components/contact-dialog";
import ContactList from "./components/contact-list";
import {
  type ContactEntity,
  type ContactPayload,
  useCreateContact,
  useDeleteContact,
  useGetContacts,
  useUpdateContact,
} from "./hook";

const normalizeContacts = (payload: unknown): ContactEntity[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload as ContactEntity[];
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: ContactEntity[] }).data;
  }

  return [];
};

const extractId = (contact: ContactEntity | null) =>
  contact?._id ?? contact?.id ?? "";

const sanitizeSocialLinks = (
  socialLinks: ContactPayload["socialLinks"] | undefined
): ContactPayload["socialLinks"] => {
  if (!Array.isArray(socialLinks)) {
    return [];
  }

  return socialLinks
    .map((link) => ({
      label: link?.label?.trim() ?? "",
      href: link?.href?.trim() ?? "",
    }))
    .filter((link) => link.label || link.href);
};

const sanitizePayload = (values: ContactPayload): ContactPayload => ({
  address: values.address.trim(),
  phone: values.phone.trim(),
  email: values.email.trim(),
  mapPhoto: values.mapPhoto.trim(),
  socialLinks: sanitizeSocialLinks(values.socialLinks),
});

const getErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return (
    axiosError?.response?.data?.message ||
    axiosError?.message ||
    "Something went wrong."
  );
};

export default function ContactPage() {
  const { data, isLoading } = useGetContacts();
  const { mutate: createContact, isPending: isCreating } = useCreateContact();
  const { mutate: updateContact, isPending: isUpdating } = useUpdateContact();
  const { mutate: deleteContact, isPending: isDeleting } = useDeleteContact();

  const contacts = useMemo(() => normalizeContacts(data), [data]);

  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactEntity | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isSubmitting = isCreating || isUpdating;

  const handleCreateClick = () => {
    setSelectedContact(null);
    setOpen(true);
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelectedContact(null);
    }
  };

  const handleSubmit = (values: ContactPayload) => {
    const payload = sanitizePayload(values);
    const id = extractId(selectedContact);

    if (id) {
      updateContact(
        { id, payload },
        {
          onSuccess: () => {
            toast.success("Contact updated successfully.");
            setSelectedContact(null);
            setOpen(false);
          },
          onError: (error) => {
            toast.error(getErrorMessage(error));
          },
        }
      );
      return;
    }

    createContact(payload, {
      onSuccess: () => {
        toast.success("Contact created successfully.");
        setSelectedContact(null);
        setOpen(false);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const handleEdit = (contact: ContactEntity) => {
    setSelectedContact(contact);
    setOpen(true);
  };

  const handleDelete = (contact: ContactEntity) => {
    const id = extractId(contact);
    if (!id) {
      toast.error("Unable to determine which contact to delete.");
      return;
    }

    const confirmation = window.confirm(
      "Are you sure you want to delete this contact?"
    );

    if (!confirmation) return;

    setDeletingId(id);
    deleteContact(
      { id },
      {
        onSuccess: () => {
          toast.success("Contact deleted successfully.");
          if (extractId(selectedContact) === id) {
            setSelectedContact(null);
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
          label="Create contact"
          onClick={handleCreateClick}
          startAdornment={<Plus className="h-4 w-4" />}
        />
      </div>
      <ContactList
        contacts={contacts}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        activeContactId={extractId(selectedContact)}
        deletingId={deletingId}
        isDeleting={isDeleting}
      />
      <ContactDialog
        onOpenChange={handleDialogOpenChange}
        open={open}
        initialValues={selectedContact}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        mode={selectedContact ? "edit" : "create"}
      />
    </main>
  );
}
