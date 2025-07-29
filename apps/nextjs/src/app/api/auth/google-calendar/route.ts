import { env } from "@/env";
import { OAuth2Client } from "google-auth-library";

export function GET(_request: Request) {
  const oAuth2Client = new OAuth2Client(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI,
  );

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
    prompt: "consent",
  });

  return new Response(JSON.stringify({ authorizeUrl: authorizeUrl }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
