import { defineMiddleware } from "astro:middleware";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "astro:env/server";
import {
  isAccessTokenExpiringSoon,
  refreshGoogleAccessToken,
} from "./lib/auth";

const protectedPaths = ["/account", "/dashboard"];

function isProtectedPath(pathname: string): boolean {
  return protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) {
    return next();
  }

  const session = context.session;
  const tokens = await session?.get("google_tokens");
  const refreshToken = tokens?.refresh_token;
  const clientId = GOOGLE_CLIENT_ID;
  const clientSecret = GOOGLE_CLIENT_SECRET;

  if (
    session &&
    tokens &&
    refreshToken &&
    clientId &&
    clientSecret &&
    isAccessTokenExpiringSoon(tokens.expiry_date)
  ) {
    try {
      const newTokens = await refreshGoogleAccessToken(
        clientId,
        clientSecret,
        refreshToken
      );
      await session.set("google_tokens", {
        access_token: newTokens.access_token ?? tokens.access_token,
        refresh_token: newTokens.refresh_token ?? refreshToken,
        expiry_date: newTokens.expiry_date ?? tokens.expiry_date,
      });
    } catch (err) {
      console.error("Middleware: refresh access token failed", err);
    }
  }
  return next();
});
