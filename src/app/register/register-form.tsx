"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";

import { useCreateSuperAdmin } from "./hook";
import type { SuperAdminForm } from "./model";

const initialFormValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

type RegisterFormState = typeof initialFormValues;

export default function RegisterForm() {
  const router = useRouter();
  const [formValues, setFormValues] = useState<RegisterFormState>(
    initialFormValues
  );
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    mutate: createSuperAdmin,
    isPending,
    error: mutationError,
  } = useCreateSuperAdmin({
    onSuccess: () => {
      toast.success("Шинэ админ амжилттай бүртгэгдлээ.");
      setFormValues(initialFormValues);
      router.push("/login");
    },
    onError: () => {
      toast.error("Бүртгүүлэх явцад алдаа гарлаа. Дахин оролдоно уу.");
    },
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    if (formValues.password !== formValues.confirmPassword) {
      setLocalError("Нууц үг хоорондоо таарахгүй байна.");
      return;
    }

    const payload: SuperAdminForm = {
      username: formValues.username.trim(),
      email: formValues.email.trim(),
      password: formValues.password,
    };

    createSuperAdmin(payload);
  };

  const remoteErrorMessage = mutationError
    ? "Бүртгүүлэх явцад алдаа гарлаа. Та дахин оролдоно уу."
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
        <div className="px-8 py-10">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold text-slate-900">
              Шинэ хэрэглэгч үүсгэх
            </h1>
            <p className="text-sm text-slate-500">
              Админ хэсэгт нэвтрэх эрхтэй шинэ хэрэглэгч бүртгэнэ үү.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <label className="block text-left text-sm font-medium text-slate-700">
                Нэр
                <input
                  type="text"
                  name="username"
                  required
                  autoComplete="name"
                  value={formValues.username}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="Таны нэр"
                />
              </label>

              <label className="block text-left text-sm font-medium text-slate-700">
                И-мэйл хаяг
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={formValues.email}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="ta@example.com"
                />
              </label>

              <label className="block text-left text-sm font-medium text-slate-700">
                Нууц үг
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="new-password"
                  value={formValues.password}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="Дор хаяж 8 тэмдэгт"
                  minLength={8}
                />
              </label>

              <label className="block text-left text-sm font-medium text-slate-700">
                Нууц үг баталгаажуулах
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  autoComplete="new-password"
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="Нууц үгээ давтан оруул"
                  minLength={8}
                />
              </label>
            </div>

            {(localError || remoteErrorMessage) && (
              <p className="text-sm text-red-500">
                {localError ?? remoteErrorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Бүртгэж байна..." : "Бүртгүүлэх"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Аль хэдийн хэрэглэгч юу?{" "}
            <Link
              href="/login"
              className="font-medium text-slate-600 transition hover:text-slate-900"
            >
              Нэвтрэх
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
