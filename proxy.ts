import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

function redirectWithCookies(url: URL, source: NextResponse) {
  const redirectResponse = NextResponse.redirect(url);

  for (const cookie of source.cookies.getAll()) {
    redirectResponse.cookies.set(cookie);
  }

  for (const name of ["cache-control", "expires", "pragma"]) {
    const value = source.headers.get(name);

    if (value) {
      redirectResponse.headers.set(name, value);
    }
  }

  return redirectResponse;
}

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (!user && pathname !== "/login") {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";

    return redirectWithCookies(loginUrl, response);
  }

  if (user && pathname === "/login") {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    homeUrl.search = "";

    return redirectWithCookies(homeUrl, response);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
