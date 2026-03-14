/// <reference types="astro/client" />

declare namespace App {
  interface SessionData {
    user: {
      id: string;
      name: string;
      email: string;
      picture?: string;
    };
    google_tokens?: {
      access_token?: string;
      refresh_token?: string;
      expiry_date?: number;
    };
  }
}
