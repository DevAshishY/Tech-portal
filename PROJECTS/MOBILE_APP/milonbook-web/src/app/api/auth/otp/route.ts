
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/dbConnect";
import OTPModel from "@/models/otp";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP
    await OTPModel.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // GoDaddy SMTP transporter
    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465, // SSL
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: `"MilonBook" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("Send OTP error:", error.response || error.message || error);
    return NextResponse.json(
      { success: false, message: "Error sending OTP" },
      { status: 500 }
    );
  }
}
