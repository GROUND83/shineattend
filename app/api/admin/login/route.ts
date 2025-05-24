// app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import { encryptCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json();
  console.log("password", password);
  if (authenticate(password)) {
    const encryptedValue = await encryptCookie(password);
    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin-auth", encryptedValue, {
      httpOnly: true,
      path: "/",
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
    });
    return response;
  }

  return new NextResponse("Unauthorized", { status: 401 });
}
