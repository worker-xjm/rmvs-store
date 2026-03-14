import Ky from "ky";
export const kyClient = Ky.create();
/**
 * Base URL for the site (no trailing slash).
 * Uses the request origin when on localhost (dev/preview); otherwise uses Astro's `site` when set.
 */
export function getBaseUrl(request: Request): string {
  const url = new URL(request.url);
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
    return url.origin;
  }
  const fromSite = import.meta.env.SITE;
  if (fromSite && typeof fromSite === "string") {
    return fromSite.replace(/\/$/, "");
  }
  return url.origin;
}

export const OAUTH_STATE_COOKIE = "oauth_state";
export const OAUTH_STATE_MAX_AGE = 600; // 10 minutes

/** 提前多少毫秒视为「即将过期」并触发刷新 */
export const TOKEN_EXPIRY_BUFFER_MS = 10 * 60 * 1000; // 10 分钟

export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
export const GOOGLE_USERINFO_URL =
  "https://www.googleapis.com/oauth2/v2/userinfo";

export const SCOPES = [
  "openid",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export interface GoogleTokens {
  access_token?: string;
  refresh_token?: string;
  expiry_date?: number;
}

/** 用授权码向 Google 换取 access_token（及可选的 refresh_token） */
export async function exchangeCodeForTokens(
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  code: string
): Promise<GoogleTokens> {
  const res = await kyClient.post(GOOGLE_TOKEN_URL, {
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google token error: ${res.status} ${text}`);
  }
  const data = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };
  const expiryDate =
    data.expires_in != null
      ? Date.now() + data.expires_in * 1000
      : undefined;
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expiry_date: expiryDate,
  };
}

/**
 * 使用 refresh_token 刷新 Google access token。
 * 返回新的 access_token 与 expiry_date，refresh_token 不变。
 */
export async function refreshGoogleAccessToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<GoogleTokens> {
  const res = await kyClient.post(GOOGLE_TOKEN_URL, {
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "authorization_code",
    })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google refresh token error: ${res.status} ${text}`);
  }
  const data = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  const expiryDate =
    data.expires_in != null
      ? Date.now() + data.expires_in * 1000
      : undefined;
  return {
    access_token: data.access_token,
    refresh_token: refreshToken,
    expiry_date: expiryDate,
  };
}

/** 用 access_token 请求 Google 用户信息 */
export async function fetchGoogleUserInfo(accessToken: string): Promise<{
  id?: string | null;
  name?: string | null;
  email?: string | null;
  picture?: string | null;
}> {
  const res = await kyClient.get(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google userinfo error: ${res.status} ${text}`);
  }
  return (await res.json()) as {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
  };
}

/**
 * 判断 access token 是否在 bufferMs 内即将过期（或已过期）。
 */
export function isAccessTokenExpiringSoon(
  expiryDateMs: number | undefined,
  bufferMs: number = TOKEN_EXPIRY_BUFFER_MS
): boolean {
  if (expiryDateMs == null) return true;
  return Date.now() >= expiryDateMs - bufferMs;
}
