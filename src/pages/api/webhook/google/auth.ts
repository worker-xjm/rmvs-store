import type { APIRoute } from "astro";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "astro:env/server";
import {
  getBaseUrl,
  OAUTH_STATE_COOKIE,
  GOOGLE_TOKEN_URL,
  GOOGLE_USERINFO_URL,
} from "../../../../lib/auth";

export const GET: APIRoute = async ({
  request,
  cookies,
  redirect,
  session,
}) => {
  const clientId = GOOGLE_CLIENT_ID;
  const clientSecret = GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return new Response("Google OAuth is not configured", { status: 500 });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const storedState = cookies.get(OAUTH_STATE_COOKIE)?.value;
  cookies.delete(OAUTH_STATE_COOKIE, { path: "/" });

  if (!code || !state || state !== storedState) {
    return redirect("/", 302);
  }

  const baseUrl = getBaseUrl(request);
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    console.error("Google token error:", err);
    return redirect("/", 302);
  }

  const tokenData = (await tokenRes.json()) as { access_token?: string };
  const accessToken = tokenData.access_token;
  if (!accessToken) {
    return redirect("/", 302);
  }

  const userRes = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!userRes.ok) {
    return redirect("/", 302);
  }

  const profile = (await userRes.json()) as {
    id: string;
    name?: string;
    email?: string;
    picture?: string;
  };

  const user = {
    id: profile.id,
    name: profile.name ?? "",
    email: profile.email ?? "",
    picture: profile.picture,
  };

  await session?.set("user", user);

  return redirect("/", 302);
};
