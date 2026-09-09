import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_idp_real_estate_2026";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only gate /api/ routes in proxy middleware; page routes are protected per-tab on the client
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Define public API paths that don't need auth
  const isPublicApi =
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/signup") ||
    pathname.startsWith("/api/auth/logout") ||
    pathname.startsWith("/api/test_db");

  if (isPublicApi) {
    return NextResponse.next();
  }

  // Get token from Authorization header first (tab-specific), fallback to cookie
  const authHeader = req.headers.get("authorization");
  let token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : req.cookies.get("token")?.value;

  // If no token and trying to access protected API
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized access: Token missing" },
      { status: 401 }
    );
  }

  try {
    const { payload } = await jwtVerify(token, secretKey);
    const userRole = payload.role as string;

    // Check Role-Based Access Control for APIs
    if (pathname.startsWith("/api/admin") && pathname !== "/api/admin/claim") {
      if (userRole !== "ADMIN") {
        return NextResponse.json(
          { success: false, message: "Forbidden: Admin access required" },
          { status: 403 }
        );
      }
    }

    if (pathname.startsWith("/api/lawyer")) {
      if (userRole !== "LAWYER" && userRole !== "ADMIN") {
        return NextResponse.json(
          { success: false, message: "Forbidden: Lawyer access required" },
          { status: 403 }
        );
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
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

// Keep middleware alias export for backwards compatibility
export { proxy as middleware };

export const config = {
  matcher: [
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
