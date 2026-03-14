import { defineMiddleware } from "astro:middleware";

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

  const pathname = context.url.pathname;

  if (isProtectedPath(pathname)) {
    const user = await context.session?.get("user");
    if (!user) {
      return context.redirect("/", 302);
    }
  }

  return next();
});
