// app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import { attendauthenticate, encryptCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json();
  console.log("password", password);
  if (attendauthenticate(password)) {
    const encryptedValue = await encryptCookie(password);
    const response = NextResponse.json({ ok: true });
    response.cookies.set("attend-auth", encryptedValue, {
      httpOnly: true,
      path: "/",
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: "strict",
    });
    return response;
  }

  return new NextResponse("Unauthorized", { status: 401 });
}
