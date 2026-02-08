import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { checkSessionWithCookie } from "./lib/api/middlewareApi";

const isPrivateRoute = (pathname: string) =>
  pathname.startsWith("/profile") || pathname.startsWith("/notes");

const isAuthRoute = (pathname: string) =>
  pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

function buildCookieHeader(req: NextRequest) {
  return req.cookies
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}


function getTokenFromCookieHeader(cookieHeader: string, tokenName: string) {
  const match = cookieHeader
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${tokenName}=`));

  if (!match) return undefined;
  return decodeURIComponent(match.slice(tokenName.length + 1));
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  
  const cookieHeader = req.headers.get("cookie") ?? "";

  const accessToken =
    req.cookies.get("accessToken")?.value ??
    getTokenFromCookieHeader(cookieHeader, "accessToken");

  const refreshToken =
    req.cookies.get("refreshToken")?.value ??
    getTokenFromCookieHeader(cookieHeader, "refreshToken");

  let isAuthenticated = Boolean(accessToken);
  let setCookieHeader = "";

 
  if (!isAuthenticated && refreshToken) {
    const session = await checkSessionWithCookie(cookieHeader || buildCookieHeader(req));

    if (session.ok && session.data) {
      isAuthenticated = true;
      setCookieHeader = session.setCookie; // може містити оновлені токени
    }
  }

 
  if (!isAuthenticated && isPrivateRoute(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isAuthRoute(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/"; // ✅ за вимогою перевірки
    const res = NextResponse.redirect(url);

    
    if (setCookieHeader) {
      const parts = setCookieHeader.split(/,(?=[^;]+?=)/g);
      for (const part of parts) {
        const [pair] = part.split(";");
        const [name, value] = pair.split("=");
        if (!name || value === undefined) continue;

        const n = name.trim();
        if (n === "accessToken" || n === "refreshToken") {
          res.cookies.set(n, value, { path: "/" });
        }
      }
    }

    return res;
  }

  
  const res = NextResponse.next();

  if (setCookieHeader) {
    const parts = setCookieHeader.split(/,(?=[^;]+?=)/g);
    for (const part of parts) {
      const [pair] = part.split(";");
      const [name, value] = pair.split("=");
      if (!name || value === undefined) continue;

      const n = name.trim();
      if (n === "accessToken" || n === "refreshToken") {
        res.cookies.set(n, value, { path: "/" });
      }
    }
  }

  return res;
}
