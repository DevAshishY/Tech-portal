import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  const jwtSecret = process.env.JWT_SECRET;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  try {
    const decoded = jwt.verify(token, jwtSecret!) as { role: string; email: string };

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return NextResponse.json({ data: "Admin dashboard data" });
  } catch {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}
