import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ redirect, session }) => {
  await session?.destroy();
  return redirect("/", 302);
};
