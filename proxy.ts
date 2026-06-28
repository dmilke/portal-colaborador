import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const publicRoutes = ["/login", "/forgot-password", "/reset-password"];
const protectedPrefixes = ["/dashboard"];

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const path = request.nextUrl.pathname;

  const isPublicRoute = publicRoutes.some((route) => path === route || path.startsWith(route + "/"));
  const isProtectedRoute = protectedPrefixes.some((prefix) => path.startsWith(prefix));

  if (isProtectedRoute && !user) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirectTo", path);
    return NextResponse.redirect(url);
  }

  if (isPublicRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
