import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login | Blog Admin",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
        <div className="px-8 py-10">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold text-slate-900">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500">
              Sign in to manage your blog posts, drafts, and site settings.
            </p>
          </div>

          <form className="mt-8 space-y-6">
            <div className="space-y-5">
              <label className="block text-left text-sm font-medium text-slate-700">
                Email address
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block text-left text-sm font-medium text-slate-700">
                Password
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="Enter your password"
                />
              </label>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                />
                Remember me
              </label>
              <Link
                href="#"
                className="font-medium text-slate-600 transition hover:text-slate-900"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Sign in
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="#"
              className="font-medium text-slate-600 transition hover:text-slate-900"
            >
              Contact the site owner
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
