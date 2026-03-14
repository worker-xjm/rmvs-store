/**
 * Base URL for the site (no trailing slash).
 * Uses Astro's `site` config when set, otherwise the request origin.
 */
export function getBaseUrl(request: Request): string {
  const fromSite = import.meta.env.SITE;
  if (fromSite && typeof fromSite === "string") {
    return fromSite.replace(/\/$/, "");
  }
  return new URL(request.url).origin;
}

export const OAUTH_STATE_COOKIE = "oauth_state";
export const OAUTH_STATE_MAX_AGE = 600; // 10 minutes

export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
export const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

export const SCOPES = ["openid", "email", "profile"];
