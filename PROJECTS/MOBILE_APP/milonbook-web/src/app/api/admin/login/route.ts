import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminEmail || !adminPassword || !jwtSecret) {
      return NextResponse.json(
        { success: false, message: "Server misconfiguration" },
        { status: 500 }
      );
    }

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    const isEmailMatch = String(username).trim().toLowerCase() === adminEmail.trim().toLowerCase();
    const isPasswordMatch = String(password) === adminPassword;

    if (isEmailMatch && isPasswordMatch) {
      const token = jwt.sign({ role: "admin", email: adminEmail }, jwtSecret, { expiresIn: "1d" });
      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ success: false, message: "Invalid Credentials" }, { status: 401 });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
