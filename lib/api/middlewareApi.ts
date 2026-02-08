import type { CheckSessionRequest } from "./clientApi";

export const checkSessionWithCookie = async (cookieHeader: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/session`, {
    method: "GET",
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  const setCookie = res.headers.get("set-cookie") ?? "";
  const text = await res.text().catch(() => "");
  const data = text ? (JSON.parse(text) as CheckSessionRequest) : null;

  return { ok: res.ok, data, setCookie };
};
