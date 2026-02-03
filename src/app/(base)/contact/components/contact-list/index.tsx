"use client";

import { useMemo } from "react";
import {
  Image as ImageIcon,
  Link2,
  Mail,
  MapPin,
  Phone,
  Edit,
  Trash2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import type { ContactEntity } from "../../hook";

type ContactListProps = {
  contacts: ContactEntity[];
  isLoading?: boolean;
  onEdit: (contact: ContactEntity) => void;
  onDelete: (contact: ContactEntity) => void;
  activeContactId?: string | null;
  deletingId?: string | null;
  isDeleting?: boolean;
};

const extractId = (contact: ContactEntity) => contact?._id ?? contact?.id ?? "";

export default function ContactList({
  contacts,
  isLoading = false,
  onEdit,
  onDelete,
  activeContactId,
  deletingId,
  isDeleting,
}: ContactListProps) {
  const showLoadingState = useMemo(
    () => isLoading && (!contacts || contacts.length === 0),
    [contacts, isLoading]
  );

  if (showLoadingState) {
    return (
      <Card className="p-6 shadow-2xl">
        <div className="space-y-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </Card>
    );
  }

  if (!isLoading && contacts.length === 0) {
    return (
      <Card className="p-6 text-sm text-gray-500 shadow-2xl">
        Одоогоор холбоо барих мэдээлэл нэмэгдээгүй байна. &ldquo;Холбоо барих
        мэдээлэл нэмэх&rdquo; товчийг дарж эхлээрэй.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {contacts.map((contact) => {
        const id = extractId(contact);
        const isActive = id && activeContactId && id === activeContactId;
        const isContactDeleting = Boolean(isDeleting && deletingId === id);

        return (
          <Card
            key={id || contact.email || contact.phone || contact.address}
            className={`border ${
              isActive ? "border-primary" : "border-transparent"
            } p-6 shadow-2xl transition-shadow`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 space-y-3">
                {contact.address && (
                  <p className="flex items-start gap-2 text-sm text-gray-700">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                    <span className="min-w-0 break-words whitespace-pre-line leading-relaxed">
                      {contact.address}
                    </span>
                  </p>
                )}

                {contact.phone && (
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="min-w-0 break-words">{contact.phone}</span>
                  </p>
                )}

                {contact.email && (
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="min-w-0 break-words text-primary underline"
                    >
                      {contact.email}
                    </a>
                  </p>
                )}

                {contact.mapPhoto && (
                  <p className="flex items-center gap-2 text-sm text-gray-700">
                    <ImageIcon className="h-4 w-4 text-gray-500" />
                    <a
                      href={contact.mapPhoto}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-primary underline"
                    >
                      Газрын зураг харах
                    </a>
                  </p>
                )}

                {Array.isArray(contact.socialLinks) &&
                  contact.socialLinks.length > 0 && (
                    <div className="space-y-2">
                      <p className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Link2 className="h-4 w-4 text-gray-500" />
                        Нийгмийн сувгууд
                      </p>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {contact.socialLinks.map((link, index) => {
                          const key = `${link?.label ?? "link"}-${index}`;
                          const displayLabel = link?.label?.trim();
                          const displayHref = link?.href?.trim();

                          if (!displayLabel && !displayHref) {
                            return null;
                          }

                          return (
                            <li key={key} className="flex flex-col gap-0.5">
                              <span className="font-medium text-gray-700">
                                {displayLabel || "Холбоос"}
                              </span>
                              {displayHref ? (
                                <a
                                  href={displayHref}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="break-all text-primary underline"
                                >
                                  {displayHref}
                                </a>
                              ) : null}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
              </div>

              <div className="flex shrink-0 gap-2">
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onEdit(contact)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Засах
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(contact)}
                  disabled={isContactDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isContactDeleting ? "Устгаж байна..." : "Устгах"}
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
