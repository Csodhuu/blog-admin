import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const upstream = await fetch(
    "https://backend.gatewaysportstravel.mn/api/admin/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const data = await upstream.json().catch(() => ({}));

  if (!upstream.ok) {
    return NextResponse.json(
      { message: data?.message || "Нэвтрэх явцад алдаа гарлаа." },
      { status: upstream.status }
    );
  }

  const accessToken = data.token;

  const res = NextResponse.json({ ok: true });

  const host = req.headers.get("host") || "";
  const cookieDomain = host.endsWith("gatewaysportstravel.mn")
    ? ".gatewaysportstravel.mn"
    : undefined;

  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: false, // REQUIRED on cPanel
    sameSite: "lax",
    path: "/", // 🔴 REQUIRED
    domain: cookieDomain, // 🔴 REQUIRED
    maxAge: 60 * 60 * 12,
  });

  return res;
}
