"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function AuthSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  if (process.env.NEXT_PUBLIC_ENABLE_NEXTAUTH !== "true") {
    return <>{children}</>;
  }

  return <SessionProvider>{children}</SessionProvider>;
}
