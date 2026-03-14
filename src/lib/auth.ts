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

export const SCOPES = [
  "openid",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];
