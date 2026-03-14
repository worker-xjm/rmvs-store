import type { APIRoute } from "astro";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "astro:env/server";
import {
  getBaseUrl,
  OAUTH_STATE_COOKIE,
  exchangeCodeForTokens,
  fetchGoogleUserInfo,
} from "../../../../lib/auth";
export const prerender = false;

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
  const redirectUri = `${baseUrl}/api/webhook/google/auth`;

  let tokens: {
    access_token?: string;
    refresh_token?: string;
    expiry_date?: number;
  };
  try {

    tokens = await exchangeCodeForTokens(
      clientId,
      clientSecret,
      redirectUri,
      code
    );
  } catch (err) {
    console.error("Google token error:", err);
    return redirect("/", 302);
  }

  const accessToken = tokens.access_token;
  if (!accessToken) {
    return redirect("/", 302);
  }

  let data: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
  };
  try {
    data = await fetchGoogleUserInfo(accessToken);
  } catch (err) {
    console.error("Google userinfo error:", err);
    return redirect("/", 302);
  }

  const user = {
    id: data.id ?? "",
    name: data.name ?? "",
    email: data.email ?? "",
    picture: data.picture ?? undefined,
  };

  await session?.set("user", user);
  if (tokens.access_token != null || tokens.refresh_token != null) {
    await session?.set("google_tokens", {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
    });
  }

  return redirect("/", 302);
};
