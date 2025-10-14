"use client";

import { useMemo } from "react";
import { Edit, Mail, ShieldCheck, Trash2, UserCircle2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import type { AdminUserEntity } from "../../model";

interface AdminUserListProps {
  users: AdminUserEntity[];
  isLoading?: boolean;
  onEdit: (user: AdminUserEntity) => void;
  onDelete: (user: AdminUserEntity) => void;
  activeUserId?: string | null;
  deletingId?: string | null;
  isDeleting?: boolean;
}

const extractId = (user: AdminUserEntity) => user?._id ?? user?.id ?? "";

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

export default function AdminUserList({
  users,
  isLoading = false,
  onEdit,
  onDelete,
  activeUserId,
  deletingId,
  isDeleting,
}: AdminUserListProps) {
  const showLoadingState = useMemo(
    () => isLoading && (!users || users.length === 0),
    [isLoading, users]
  );

  if (showLoadingState) {
    return (
      <Card className="p-6 shadow-2xl">
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </Card>
    );
  }

  if (!isLoading && users.length === 0) {
    return (
      <Card className="p-6 text-sm text-gray-500 shadow-2xl">
        Одоогоор админ хэрэглэгч үүсгээгүй байна. &ldquo;Админ хэрэглэгч нэмэх&rdquo;
        товчийг дарж эхлээрэй.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => {
        const id = extractId(user);
        const isActive = id && activeUserId && id === activeUserId;
        const isUserDeleting = Boolean(isDeleting && deletingId === id);

        return (
          <Card
            key={id || user.username || user.email}
            className={`border ${
              isActive ? "border-primary" : "border-transparent"
            } p-6 shadow-2xl transition-shadow`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <UserCircle2 className="h-5 w-5 text-gray-500" />
                    {user.username || "Нэргүй админ"}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                      user.iSuperAdmin
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {user.iSuperAdmin ? "Супер админ" : "Энгийн админ"}
                  </span>
                </div>

                {user.email && (
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a
                      href={`mailto:${user.email}`}
                      className="text-primary underline underline-offset-2"
                    >
                      {user.email}
                    </a>
                  </p>
                )}

                <div className="grid gap-1 text-xs text-gray-500">
                  <span>
                    Үүсгэсэн: <strong>{formatDate(user.createdAt)}</strong>
                  </span>
                  <span>
                    Шинэчилсэн: <strong>{formatDate(user.updatedAt)}</strong>
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onEdit(user)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Засах
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(user)}
                  disabled={isUserDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isUserDeleting ? "Устгаж байна..." : "Устгах"}
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
