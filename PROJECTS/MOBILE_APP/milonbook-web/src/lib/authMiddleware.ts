// File: lib/authMiddleware.ts
// CREATE this new file

import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "../utils/auth"; // 
import dbConnect from "./dbConnect";
import User from "@/models/User";

export interface AuthRequest extends NextRequest {
  user?: {
    userId: string;
    email?: string;
    phone?: string;
    name: string;
  };
}

export interface AuthResult {
  authorized: boolean;
  user?: {
    userId: string;
    email?: string;
    phone?: string;
    name: string;
    createdAt?: Date;
  };
  error?: string;
}

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user data to request
 * 
 * @param request - NextRequest object
 * @returns AuthResult with authorized status and user data
 * 
 * @example
 * const authResult = await authMiddleware(request);
 * if (!authResult.authorized) {
 *   return unauthorizedResponse(authResult.error);
 * }
 * // User is authenticated, proceed with logic
 */
export async function authMiddleware(request: NextRequest): Promise<AuthResult> {
  try {
    // 1. Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        authorized: false,
        error: "No token provided. Please login.",
      };
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    if (!token || token.trim() === "") {
      return {
        authorized: false,
        error: "Invalid token format.",
      };
    }

    // 2. Verify token using your existing verifyAuthToken function
    const decoded = verifyAuthToken(token);
    
    if (!decoded) {
      return {
        authorized: false,
        error: "Invalid or expired token. Please login again.",
      };
    }

    // 3. If this is an admin token without userId, authorize without DB lookup
    if (!decoded.userId && decoded.role === "admin") {
      return {
        authorized: true,
        user: {
          userId: "admin",
          email: decoded.email,
          name: "Admin",
        },
      };
    }

    // 4. Connect to database and fetch user for normal user tokens
    await dbConnect();
    
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return {
        authorized: false,
        error: "User not found. Please login again.",
      };
    }

    // 5. Return authorized with user data
    return {
      authorized: true,
      user: {
        userId: user._id.toString(),
        email: user.email || undefined,
        phone: user.phone || undefined,
        name: user.name,
        createdAt: user.createdAt,
      },
    };
  } catch (error: any) {
    console.error("Auth middleware error:", error);
    return {
      authorized: false,
      error: "Authentication failed.",
    };
  }
}

/**
 * Helper function to create unauthorized error responses
 * 
 * @param message - Error message to return
 * @returns NextResponse with 401 status
 * 
 * @example
 * if (!authResult.authorized) {
 *   return unauthorizedResponse(authResult.error);
 * }
 */
export function unauthorizedResponse(message: string = "Unauthorized"): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 401 }
  );
}