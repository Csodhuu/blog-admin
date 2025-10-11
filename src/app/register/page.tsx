import type { Metadata } from "next";
import Link from "next/link";
import { useCreateSuperAdmin } from "./hook";

export const metadata: Metadata = {
  title: "Бүртгүүлэх | Блог Админ",
};

export default function RegisterPage() {
  const { mutate: createBookingTime } = useCreateSuperAdmin({
    onSuccess: () => {},
  });
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

          <form className="mt-8 space-y-6">
            <div className="space-y-5">
              <label className="block text-left text-sm font-medium text-slate-700">
                Нэр
                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
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
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="Нууц үгээ давтан оруул"
                  minLength={8}
                />
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Бүртгүүлэх
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
