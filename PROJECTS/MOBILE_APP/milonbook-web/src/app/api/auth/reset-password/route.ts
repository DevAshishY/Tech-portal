import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log("Received body:", body);

    const { identifier, newPassword } = body || {};

    if (!identifier || !newPassword) {
      return NextResponse.json(
        { success: false, message: "All fields required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ❌ Don't hash here (schema will do it automatically)
    user.password = newPassword;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, message: "Error resetting password" },
      { status: 500 }
    );
  }
}
