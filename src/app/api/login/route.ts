import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const data = await fetch("YOUR_BACKEND_LOGIN", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((res) => res.json());

  const accessToken = data.accessToken || data.token;
  const refreshToken = data.refreshToken || data.refresh_token;

  const res = NextResponse.json({ ok: true });

  if (accessToken) {
    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // ✅ REQUIRED on cPanel
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
  }

  if (refreshToken) {
    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return res;
}
