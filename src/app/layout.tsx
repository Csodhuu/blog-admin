import "./globals.css";
import type { Metadata } from "next";
import { ReactNode, Suspense } from "react";
import { Toaster } from "sonner";
import WithAuthClient from "@/components/with-auth/with-auth";

export const metadata: Metadata = {
  title: "ERP-Frontend",
  description: "Your app description",
};

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <head />
      <body>
        <WithAuthClient>
          <Suspense>{children}</Suspense>
          <Toaster position="top-center" richColors />
        </WithAuthClient>
      </body>
    </html>
  );
}
