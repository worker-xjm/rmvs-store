import type { APIRoute } from "astro";
import { google } from "googleapis";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "astro:env/server";
import {
  getBaseUrl,
  OAUTH_STATE_COOKIE,
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
  const redirectUri = `${baseUrl}/api/webhook/google/auth`;

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
  } catch (err) {
    console.error("Google token error:", err);
    return redirect("/", 302);
  }

  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  let data: { id?: string | null; name?: string | null; email?: string | null; picture?: string | null };
  try {
    const res = await oauth2.userinfo.get();
    data = res.data ?? {};
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

  return redirect("/", 302);
};
