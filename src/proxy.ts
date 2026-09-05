import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_idp_real_estate_2026";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Define public paths that don't need auth
  const isPublicPath =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/properties") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/signup") ||
    pathname.startsWith("/api/test_db");

  if (isPublicPath && !pathname.startsWith("/admin") && !pathname.startsWith("/lawyer") && !pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Get token from cookie or Authorization header
  let token = req.cookies.get("token")?.value;

  const authHeader = req.headers.get("authorization");
  if (!token && authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  // If no token and trying to access protected route
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access: Token missing" },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, secretKey);
    const userRole = payload.role as string;

    // Check Role-Based Access Control
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      if (userRole !== "ADMIN") {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { success: false, message: "Forbidden: Admin access required" },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    if (pathname.startsWith("/lawyer") || pathname.startsWith("/api/lawyer")) {
      if (userRole !== "LAWYER" && userRole !== "ADMIN") {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { success: false, message: "Forbidden: Lawyer access required" },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.userId as string);
    requestHeaders.set("x-user-email", payload.email as string);
    requestHeaders.set("x-user-role", payload.role as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Auth Verification Error:", error);
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

// Keep middleware alias export for backwards compatibility
export { proxy as middleware };

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/lawyer/:path*",
    "/sell/:path*",
    "/api/admin/:path*",
    "/api/lawyer/:path*",
    "/api/verifications/:path*",
    "/api/properties/create",
    "/api/appointments/:path*",
    "/api/messages/:path*",
    "/api/payments/:path*",
    "/api/documents/:path*",
  ],
};
