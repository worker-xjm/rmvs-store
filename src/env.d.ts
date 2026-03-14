/// <reference types="astro/client" />

/** 运行时环境变量（Cloudflare Workers），无需重新构建即可生效 */
declare module "cloudflare:workers" {
  export const env: {
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
  };
}

declare namespace App {
  interface SessionData {
    user: {
      id: string;
      name: string;
      email: string;
      picture?: string;
    };
  }
}
