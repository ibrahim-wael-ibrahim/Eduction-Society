import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(function middleware(req, res) {
  const userType = req.nextauth.token.type;
  const pathName = req.nextUrl.pathname;

  if(pathName === "/take" && userType !== "STUDENT") {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if(pathName.includes("subject") && !["STUDENT", "PROFESSOR", "TEACHER"].includes(userType)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if(pathName === "/dashboard" && !["ADMIN_INSTITUTION", "ADMIN_REGISTER"].includes(userType)) {
    return NextResponse.redirect(new URL('/', req.url));
  }
});

export const config = { matcher: ["/dashboard","/take","/subject/:path*","/institution/:path*","/profile/:path*","/setting"] }
