// File: app/api/auth/verify/route.ts
// CREATE this new file

import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, unauthorizedResponse } from "@/lib/authMiddleware";

/**
 * GET /api/auth/verify
 * Verify if the provided JWT token is valid
 * 
 * @requires Authorization header with Bearer token
 * @returns User data if token is valid, error if invalid
 * 
 * @example
 * fetch('/api/auth/verify', {
 *   headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
 * })
 */
export async function GET(request: NextRequest) {
  try {
    // ✅ Use middleware to verify authentication
    const authResult = await authMiddleware(request);

    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error);
    }

    // Token is valid and user exists
    return NextResponse.json(
      {
        success: true,
        message: "Token is valid",
        user: authResult.user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Server error during token verification",
        error: error.message 
      },
      { status: 500 }
    );
  }
}