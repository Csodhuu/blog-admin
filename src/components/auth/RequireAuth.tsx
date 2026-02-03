"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/utils/authToken";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      const redirect = window.location.pathname + window.location.search;

      router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) return null; // or spinner

  return <>{children}</>;
}
