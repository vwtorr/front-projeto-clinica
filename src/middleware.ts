import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // const token = request.cookies.get("@talentTraceToken")?.value || null;
  // const user = request.cookies.get("@talentTraceUserData")?.value || null;

  // if (!user || !token) {
  //   url.pathname = "/";
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/settings/:path*"],
};
