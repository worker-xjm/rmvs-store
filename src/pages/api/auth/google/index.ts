import type { APIRoute } from "astro";
import { google } from "googleapis";
import { GOOGLE_CLIENT_ID ,GOOGLE_CLIENT_SECRET} from "astro:env/server";
import {
  getBaseUrl,
  OAUTH_STATE_COOKIE,
  OAUTH_STATE_MAX_AGE,
  SCOPES,
} from "../../../../lib/auth";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const clientId = GOOGLE_CLIENT_ID;
  if (!clientId) {
    return new Response("GOOGLE_CLIENT_ID is not configured", { status: 500 });
  }

  const state = crypto.randomUUID();
  const baseUrl = getBaseUrl(request);
  const redirectUri = `${baseUrl}/api/webhook/google/auth`;

  cookies.set(OAUTH_STATE_COOKIE, state, {
    path: "/",
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "lax",
    maxAge: OAUTH_STATE_MAX_AGE,
  });

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    GOOGLE_CLIENT_SECRET,
    redirectUri
  );
  const authUrl = oauth2Client.generateAuthUrl({
    scope: SCOPES,
    state,
    access_type: "online",
  });

  return redirect(authUrl, 302);
};
