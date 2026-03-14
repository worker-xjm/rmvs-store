import type { APIRoute } from "astro";
import { GOOGLE_CLIENT_ID } from "astro:env/server";
import {
  getBaseUrl,
  OAUTH_STATE_COOKIE,
  OAUTH_STATE_MAX_AGE,
  GOOGLE_AUTH_URL,
  SCOPES,
} from "../../../lib/auth";
export const prerender = false;
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

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES.join(" "),
    state,
    access_type: "offline",
    prompt: "consent",
  });
  const authUrl = `${GOOGLE_AUTH_URL}?${params.toString()}`;

  return redirect(authUrl, 302);
};
