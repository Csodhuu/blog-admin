"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";

import { useLogin } from "./hook";
import type { LoginForm, LoginResponse } from "./model";
import { setAccessToken } from "@/utils/authToken";

const initialFormValues: LoginForm & { remember: boolean } = {
  email: "",
  password: "",
  remember: false,
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: login, isPending } = useLogin({
    onSuccess: (data) => {
      handleSuccessfulLogin(data);
    },
    onError: (error) => {
      setErrorMessage(error.message || "Нэвтрэх явцад алдаа гарлаа.");
      toast.error(error.message || "Нэвтрэх явцад алдаа гарлаа.");
    },
  });

  const handleSuccessfulLogin = async (data: LoginResponse) => {
    if (!!data?.token) setAccessToken(data.token);
    setErrorMessage(null);

    toast.success("Амжилттай нэвтэрлээ.");
    const redirect = searchParams.get("redirect") || "/admin-user";

    router.replace(redirect);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!formValues.email.trim() || !formValues.password) {
      setErrorMessage("Нэвтрэх нэр болон нууц үгээ оруулна уу.");
      return;
    }

    const payload: LoginForm = {
      email: formValues.email.trim(),
      password: formValues.password,
    };

    login(payload);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
        <div className="px-8 py-10">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold text-slate-900">
              Дахин тавтай морил
            </h1>
            <p className="text-sm text-slate-500">
              Блогийн нийтлэл, ноорог болон сайтын тохиргоог удирдахын тулд
              нэвтэрнэ үү.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <label className="block text-left text-sm font-medium text-slate-700">
                Нэвтрэх нэр
                <input
                  type="text"
                  name="email"
                  required
                  autoComplete="username"
                  value={formValues.email}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="Нэвтрэх нэрээ оруулна уу"
                />
              </label>

              <label className="block text-left text-sm font-medium text-slate-700">
                Нууц үг
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  value={formValues.password}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="Нууц үгээ оруулна уу"
                  minLength={8}
                />
              </label>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formValues.remember}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                />
                Намайг сана
              </label>
              <Link
                href="#"
                className="font-medium text-slate-600 transition hover:text-slate-900"
              >
                Нууц үг мартсан?
              </Link>
            </div>

            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Нэвтэрч байна..." : "Нэвтрэх"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Данс байхгүй байна уу?{" "}
            <Link
              href="/register"
              className="font-medium text-slate-600 transition hover:text-slate-900"
            >
              Бүртгүүлэх
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function extractToken(
  data: LoginResponse,
  possibleKeys: string[],
): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  for (const key of possibleKeys) {
    const value = data[key as keyof LoginResponse];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return null;
}
