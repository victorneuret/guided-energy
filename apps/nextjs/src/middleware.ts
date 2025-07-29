import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/env";

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue ?? "").split(":");

    const validUser = env.BASIC_AUTH_USER;
    const validPassWord = env.BASIC_AUTH_PASSWORD;

    if (user === validUser && pwd === validPassWord) {
      return NextResponse.next();
    }
  }
  url.pathname = "/api/auth";

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/"],
};
