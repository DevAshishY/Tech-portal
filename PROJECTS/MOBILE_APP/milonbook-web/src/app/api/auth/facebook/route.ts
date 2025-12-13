import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: any) {
  try {
    const { accessToken } = await req.json();

    // Validate input
    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // ✅ Verify token with Facebook Graph API
    const fbRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    const fbUser: any = await fbRes.json();

    // ✅ Check if Facebook API returned an error
    if (fbUser.error) {
      console.error("Facebook API error:", fbUser.error);
      return NextResponse.json(
        { error: "Invalid Facebook token" },
        { status: 401 }
      );
    }

    // ✅ Verify token authenticity with App validation
    const appRes = await fetch(
      `https://graph.facebook.com/app?access_token=${accessToken}`
    );
    const appData: any = await appRes.json();

    if (appData.id !== process.env.FACEBOOK_APP_ID) {
      return NextResponse.json(
        { error: "Token does not belong to this app" },
        { status: 401 }
      );
    }

    // ✅ Check if email is available
    if (!fbUser.email) {
      return NextResponse.json(
        { error: "Email permission not granted. Please allow email access." },
        { status: 400 }
      );
    }

    // ✅ Find or create user
    let user = await User.findOne({ email: fbUser.email });

    if (!user) {
      // Create new user
      user = await User.create({
        name: fbUser.name,
        email: fbUser.email,
        registerType: "facebook",
        facebookId: fbUser.id, // ✅ Store Facebook ID for future logins
        profilePicture: fbUser.picture?.data?.url || null,
        password: `facebook-auth-${fbUser.id}`, // More unique placeholder
        isEmailVerified: true, // Facebook emails are verified
      });
    } else {
      // ✅ Update existing user if they signed up differently
      if (!user.facebookId) {
        user.facebookId = fbUser.id;
        user.isEmailVerified = true;
        await user.save();
      }
    }

    // ✅ Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Return user data (exclude sensitive fields)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      registerType: user.registerType,
    };

    return NextResponse.json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (err: any) {
    console.error("Facebook login error:", err);
    return NextResponse.json(
      { error: "Facebook login failed", details: err.message },
      { status: 500 }
    );
  }
}