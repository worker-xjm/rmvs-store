/// <reference types="astro/client" />

declare module "*.svg?raw" {
  const content: string;
  export default content;
}

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
