import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import validator from "validator";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide identifier and password" },
        { status: 400 }
      );
    }

    let user = null;

    // Detect email or phone
    if (validator.isEmail(identifier)) {
      user = await User.findOne({ email: identifier.toLowerCase() }).select("+password");
    } else if (/^[0-9+\-().\s]{6,}$/.test(identifier)) {
      user = await User.findOne({ phone: identifier.trim() }).select("+password");
    } else {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email or phone number" },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Compare hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = user.generateAuthToken();

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email || null,
          phone: user.phone || null,
          createdAt: user.createdAt,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during login", error: error.message },
      { status: 500 }
    );
  }
}
