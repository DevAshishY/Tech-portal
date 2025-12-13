import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OTPModel from "@/models/otp";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, message: "Email and OTP required" }, { status: 400 });
    }

    const record = await OTPModel.findOne({ email, otp });
    if (!record) {
      return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      await OTPModel.deleteOne({ _id: record._id });
      return NextResponse.json({ success: false, message: "OTP expired" }, { status: 400 });
    }

    // OTP is valid — delete it after verification
    await OTPModel.deleteOne({ _id: record._id });

    return NextResponse.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ success: false, message: "Error verifying OTP" }, { status: 500 });
  }
}
