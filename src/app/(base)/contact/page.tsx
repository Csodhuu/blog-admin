"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  type ContactEntity,
  type ContactPayload,
  useCreateContact,
  useDeleteContact,
  useGetContacts,
  useUpdateContact,
} from "./hook";

type ContactFormValues = ContactPayload;

const createEmptyFormState = (): ContactFormValues => ({
  address: "",
  phone: "",
  email: "",
  socialLinks: [],
  mapPhoto: "",
});

const normalizeContacts = (payload: unknown): ContactEntity[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload as ContactEntity[];
  }

  if (typeof payload === "object" && payload !== null) {
    if ("data" in payload) {
      const data = (payload as { data?: unknown }).data;
      if (Array.isArray(data)) {
        return data as ContactEntity[];
      }
      if (data && typeof data === "object") {
        return [data as ContactEntity];
      }
    }

    return [payload as ContactEntity];
  }

  return [];
};

const extractId = (contact: ContactEntity | null) =>
  contact?._id ?? contact?.id ?? "";

const sanitizePayload = (values: ContactFormValues): ContactPayload => ({
  address: values.address.trim(),
  phone: values.phone.trim(),
  email: values.email.trim(),
  mapPhoto: values.mapPhoto.trim(),
  socialLinks: values.socialLinks
    .map((link) => ({
      label: link.label.trim(),
      href: link.href.trim(),
    }))
    .filter((link) => link.label || link.href),
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

  const [selectedContact, setSelectedContact] = useState<ContactEntity | null>(
    null,
  );
  const [formValues, setFormValues] = useState<ContactFormValues>(
    createEmptyFormState(),
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedContact) {
      setFormValues(createEmptyFormState());
      return;
    }

    setFormValues({
      address: selectedContact.address ?? "",
      phone: selectedContact.phone ?? "",
      email: selectedContact.email ?? "",
      mapPhoto: selectedContact.mapPhoto ?? "",
      socialLinks:
        selectedContact.socialLinks?.map((link) => ({
          label: link.label ?? "",
          href: link.href ?? "",
        })) ?? [],
    });
  }, [selectedContact]);

  const isMutating = isCreating || isUpdating;

  const handleFieldChange = (
    field: keyof ContactFormValues,
    value: ContactFormValues[keyof ContactFormValues],
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialLinkChange = (
    index: number,
    key: keyof ContactFormValues["socialLinks"][number],
    value: string,
  ) => {
    setFormValues((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, linkIndex) =>
        linkIndex === index ? { ...link, [key]: value } : link,
      ),
    }));
  };

  const addSocialLink = () => {
    setFormValues((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { label: "", href: "" }],
    }));
  };

  const removeSocialLink = (index: number) => {
    setFormValues((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, linkIndex) => linkIndex !== index),
    }));
  };

  const resetForm = () => {
    setSelectedContact(null);
    setFormValues(createEmptyFormState());
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = sanitizePayload(formValues);
    const id = extractId(selectedContact);

    if (id) {
      updateContact(
        { id, payload },
        {
          onSuccess: () => {
            toast.success("Contact updated successfully.");
            resetForm();
          },
          onError: (error) => {
            toast.error(getErrorMessage(error));
          },
        },
      );
      return;
    }

    createContact(payload, {
      onSuccess: () => {
        toast.success("Contact created successfully.");
        resetForm();
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const handleEdit = (contact: ContactEntity) => {
    setSelectedContact(contact);
  };

  const handleDelete = (contact: ContactEntity) => {
    const id = extractId(contact);
    if (!id) {
      toast.error("Unable to determine which contact to delete.");
      return;
    }

    const confirmation = window.confirm(
      "Are you sure you want to delete this contact entry?",
    );

    if (!confirmation) return;

    setDeletingId(id);
    deleteContact(
      { id },
      {
        onSuccess: () => {
          toast.success("Contact deleted successfully.");
          if (extractId(selectedContact) === id) {
            resetForm();
          }
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
        onSettled: () => {
          setDeletingId(null);
        },
      },
    );
  };

  return (
    <main className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1.9fr]">
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Contact entries
              </h2>
              <p className="text-sm text-gray-500">
                Manage how visitors can reach out to your organization.
              </p>
            </div>
            <Button onClick={resetForm} variant="outline" size="sm">
              Create new
            </Button>
          </div>
          <div className="px-5 py-4">
            {isLoading ? (
              <p className="text-sm text-gray-500">Loading contacts...</p>
            ) : contacts.length === 0 ? (
              <p className="text-sm text-gray-500">
                No contacts found. Use the form to create one.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-wide text-gray-500">
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Phone</th>
                      <th className="px-4 py-3 font-medium">Updated</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {contacts.map((contact, index) => {
                      const id = extractId(contact);
                      const isActive = id && extractId(selectedContact) === id;

                      return (
                        <tr
                          key={id || `${contact.email ?? "contact"}-${index}`}
                          className={isActive ? "bg-gray-50" : undefined}
                        >
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {contact.email || "—"}
                          </td>
                          <td className="px-4 py-3">{contact.phone || "—"}</td>
                          <td className="px-4 py-3">
                            {contact.updatedAt
                              ? new Date(contact.updatedAt).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant={isActive ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleEdit(contact)}
                              >
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(contact)}
                                disabled={isDeleting && deletingId === id}
                              >
                                {isDeleting && deletingId === id
                                  ? "Deleting..."
                                  : "Delete"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {extractId(selectedContact) ? "Edit contact" : "Create contact"}
            </h2>
            <p className="text-sm text-gray-500">
              Keep your contact information accurate and up to date.
            </p>
          </div>
          <form className="space-y-6 px-6 py-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email address
                </label>
                <Input
                  placeholder="hello@example.com"
                  value={formValues.email}
                  onChange={(event) => handleFieldChange("email", event.target.value)}
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <Input
                  placeholder="(+976) 1234-5678"
                  value={formValues.phone}
                  onChange={(event) => handleFieldChange("phone", event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <Textarea
                placeholder="Ulaanbaatar, Sukhbaatar District..."
                value={formValues.address}
                onChange={(event) => handleFieldChange("address", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Map image URL
              </label>
              <Input
                placeholder="https://example.com/map.jpg"
                value={formValues.mapPhoto}
                onChange={(event) => handleFieldChange("mapPhoto", event.target.value)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Social links
                  </h3>
                  <p className="text-xs text-gray-500">
                    Provide links to your social platforms.
                  </p>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={addSocialLink}>
                  Add link
                </Button>
              </div>

              {formValues.socialLinks.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No social links added yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {formValues.socialLinks.map((link, index) => (
                    <div
                      key={`social-link-${index}`}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-500">
                            Label
                          </label>
                          <Input
                            placeholder="Facebook"
                            value={link.label}
                            onChange={(event) =>
                              handleSocialLinkChange(
                                index,
                                "label",
                                event.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-500">
                            URL
                          </label>
                          <Input
                            placeholder="https://facebook.com/yourpage"
                            value={link.href}
                            onChange={(event) =>
                              handleSocialLinkChange(
                                index,
                                "href",
                                event.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSocialLink(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={resetForm}
                disabled={isMutating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isMutating}>
                {extractId(selectedContact) ? "Update contact" : "Create contact"}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
