/// <reference types="astro/client" />

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
