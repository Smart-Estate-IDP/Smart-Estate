import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_idp_real_estate_2026";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface TokenPayload {
  userId: string;
  email: string;
  role: "USER" | "LAWYER" | "ADMIN";
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare password
export async function comparePassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

// Sign JWT token
export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

// Verify JWT token
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

// Extract auth user from NextRequest (Cookie or Bearer token header)
export async function getAuthUser(req: NextRequest): Promise<TokenPayload | null> {
  // Check Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    return verifyToken(token);
  }

  // Check Cookies
  const tokenCookie = req.cookies.get("token")?.value;
  if (tokenCookie) {
    return verifyToken(tokenCookie);
  }

  return null;
}
