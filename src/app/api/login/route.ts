// app/api/login/route.ts
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

  const data = await upstream.json();

  if (!upstream.ok) {
    return NextResponse.json(
      { message: data?.message || "Login failed" },
      { status: upstream.status },
    );
  }

  // ✅ JUST RETURN TOKEN
  return NextResponse.json({
    token: data.token,
    admin: data.admin,
  });
}
