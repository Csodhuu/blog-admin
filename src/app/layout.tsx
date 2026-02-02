import AuthSessionProvider from "@/components/auth/session-provider";
import QueryProvider from "@/components/providers/query-provider";
import type { Metadata } from "next";
import { ReactNode, Suspense } from "react";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Блог админ самбар",
  description: "Блогийн агуулга, хэрэглэгчийг удирдах самбар",
};

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="mn" className="light" style={{ colorScheme: "light" }}>
      <head />
      <body>
        <QueryProvider>
          <AuthSessionProvider>
            <Suspense>{children}</Suspense>
            <Toaster position="top-center" richColors />
          </AuthSessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
