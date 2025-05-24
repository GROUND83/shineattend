import { NextRequest, NextResponse } from "next/server";
import { isAttendAuthenticated, isAuthenticated } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const isAdminPath = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const isAttendLoginPage = req.nextUrl.pathname === "/attend/login";
  const adminPassword = process.env.ADMIN_PASSWORD;
  const attendPassword = process.env.ATTEND_PASSWORD;
  const cookie = req.cookies.get("admin-auth")?.value;
  const attendcookie = req.cookies.get("attend-auth")?.value;
  const isAttendPath = req.nextUrl.pathname.startsWith("/attend");
  //
  if (isAdminPath && !isLoginPage) {
    const isAuth = await isAuthenticated();
    if (!isAuth) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  //
  console.log("isAttendPath", isAttendPath);
  if (isAttendPath && !isAttendLoginPage) {
    console.log("attendcookie", attendcookie);
    const isAuth = await isAttendAuthenticated();

    if (!isAuth) {
      const loginUrl = new URL("/attend/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/attend/:path*"],
};
