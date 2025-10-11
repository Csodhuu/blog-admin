"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

export default function WithAuthClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    const token = getCookie("accessToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return <>{children}</>;
}
