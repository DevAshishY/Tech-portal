// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export const hashPassword = async (password: string): Promise<string> => {
//   const salt = await bcrypt.genSalt(10);
//   return bcrypt.hash(password, salt);
// };

// export const comparePassword = async (
//   candidatePassword: string,
//   hashedPassword: string
// ): Promise<boolean> => {
//   return bcrypt.compare(candidatePassword, hashedPassword);
// };

// interface TokenPayload {
//   userId: string;
//   email?: string;
//   [key: string]: any;
// }

// export const generateAuthToken = (payload: TokenPayload): string => {
//   return jwt.sign(payload, process.env.JWT_SECRET as string, {
//     expiresIn: "7d",
//   });
// };

// export const verifyAuthToken = (
//   token: string
// ): TokenPayload | null => {
//   try {
//     return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
//   } catch (error) {
//     return null;
//   }
// };
// File: lib/auth.ts
// UPDATE this existing file - just add "export" to TokenPayload

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ CHANGE: Add "export" before interface
export interface TokenPayload {
  userId: string;
  email?: string;
  phone?: string;
  [key: string]: any;
}

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain password with a hashed password
 */
export const comparePassword = async (
  candidatePassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};

/**
 * Generate a JWT authentication token
 */
export const generateAuthToken = (payload: TokenPayload): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * Verify and decode a JWT token
 * Returns the decoded payload if valid, null if invalid/expired
 */
export const verifyAuthToken = (token: string): TokenPayload | null => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    
    return jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;
  } catch (error: any) {
    // Log different error types for debugging
    if (error.name === "TokenExpiredError") {
      console.log("Token expired");
    } else if (error.name === "JsonWebTokenError") {
      console.log("Invalid token");
    } else {
      console.error("Token verification error:", error.message);
    }
    return null;
  }
};