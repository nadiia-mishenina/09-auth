import { NextRequest, NextResponse } from "next/server";

const isPrivateRoute = (pathname: string) =>
  pathname.startsWith("/profile") || pathname.startsWith("/notes");

const isAuthRoute = (pathname: string) =>
  pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const cookie = req.headers.get("cookie") ?? "";

  
  const sessionRes = await fetch(
    new URL("/api/auth/session", req.url),
    {
      headers: { cookie },
      cache: "no-store",
    }
  );

  const isAuthenticated =
    sessionRes.ok && (await sessionRes.text()).length > 0;

 
  if (!isAuthenticated && isPrivateRoute(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  
  if (isAuthenticated && isAuthRoute(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
