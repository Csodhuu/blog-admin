import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const data = await fetch(
    "https://backend.gatewaysportstravel.mn/api/admin/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  ).then((res) => res.json());

  const accessToken = data.token;

  const res = NextResponse.json({ ok: true });

  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: false, // REQUIRED on cPanel
    sameSite: "lax",
    path: "/", // 🔴 REQUIRED
    domain: "admin.gatewaysportstravel.mn", // 🔴 REQUIRED
    maxAge: 60 * 60 * 12,
  });

  return res;
}
