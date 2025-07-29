import type { NextRequest } from "next/server";
import { env } from "@/env";
import { OAuth2Client } from "google-auth-library";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return new Response("No code provided", {
      status: 400,
    });
  }

  const oAuth2Client = new OAuth2Client(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI,
  );

  const { tokens } = await oAuth2Client.getToken(code);

  return new Response(JSON.stringify({ refresh_token: tokens.refresh_token }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
