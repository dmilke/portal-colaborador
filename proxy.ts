import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const publicRoutes = ["/login", "/forgot-password", "/reset-password"];

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const path = request.nextUrl.pathname;

  const isPublicRoute = publicRoutes.some((route) => path === route || path.startsWith(route + "/"));

  if (!isPublicRoute && !user) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirectTo", path);
    const redirect = NextResponse.redirect(url);
    // Preserve cookie updates from supabaseResponse on redirect
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirect.cookies.set(cookie.name, cookie.value, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    });
    return redirect;
  }

  if (isPublicRoute && user) {
    const url = new URL("/", request.url);
    const redirect = NextResponse.redirect(url);
    // Preserve cookie updates from supabaseResponse on redirect
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirect.cookies.set(cookie.name, cookie.value, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    });
    return redirect;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
