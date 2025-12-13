// File: src/app/api/profile/route.ts
// UPDATED to use middleware - all other logic remains the same

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { authMiddleware, unauthorizedResponse } from "@/lib/authMiddleware";

// ✅ GET - Fetch User Profile (Now Protected with Middleware)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // ✅ USE MIDDLEWARE instead of manual token verification
    const authResult = await authMiddleware(request);
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error);
    }

    // Get user profile using the userId from middleware
    const user = await User.findById(authResult.user?.userId).select("-password");
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ ALL YOUR EXISTING RESPONSE LOGIC STAYS THE SAME
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email || null,
          phone: user.phone || null,
          bio: user.bio || "",
          gender: user.gender || "",
          profilePicture: user.profilePicture || "https://i.pravatar.cc/300?img=1",
          registerType: user.registerType,
          momentsCount: user.momentsCount || 0,
          connectionsCount: user.connectionsCount || 0,
          connectingCount: user.connectingCount || 0,
          analytics: {
            totalViews: user.analytics?.totalViews || 0,
            engagementRate: user.analytics?.engagementRate || 0,
            estimatedEarnings: user.analytics?.estimatedEarnings || 0,
          },
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch profile",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// ✅ PUT - Update User Profile (Now Protected with Middleware)
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    // ✅ USE MIDDLEWARE instead of manual token verification
    const authResult = await authMiddleware(request);
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error);
    }

    // ✅ ALL YOUR EXISTING VALIDATION AND UPDATE LOGIC STAYS THE SAME
    // Parse request body
    const body = await request.json();
    const { name, bio, gender, profilePicture } = body;

    // Validate name if provided
    if (name !== undefined) {
      if (!name || name.trim().length < 2 || name.trim().length > 50) {
        return NextResponse.json(
          {
            success: false,
            message: "Name must be between 2 and 50 characters",
          },
          { status: 400 }
        );
      }
    }

    // Validate bio if provided
    if (bio !== undefined && bio.length > 200) {
      return NextResponse.json(
        {
          success: false,
          message: "Bio cannot exceed 200 characters",
        },
        { status: 400 }
      );
    }

    // Validate gender if provided
    const validGenders = ["Female", "Male", "Other", "Prefer not to say", ""];
    if (gender !== undefined && !validGenders.includes(gender)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid gender value",
        },
        { status: 400 }
      );
    }

    // Build update object (only include fields that are provided)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (bio !== undefined) updateData.bio = bio.trim();
    if (gender !== undefined) updateData.gender = gender;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    // Update user using the userId from middleware
    const user = await User.findByIdAndUpdate(
      authResult.user?.userId,  // ✅ Use userId from middleware
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ ALL YOUR EXISTING RESPONSE LOGIC STAYS THE SAME
    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email || null,
          phone: user.phone || null,
          bio: user.bio || "",
          gender: user.gender || "",
          profilePicture: user.profilePicture || "https://i.pravatar.cc/300?img=1",
          registerType: user.registerType,
          momentsCount: user.momentsCount || 0,
          connectionsCount: user.connectionsCount || 0,
          connectingCount: user.connectingCount || 0,
          analytics: {
            totalViews: user.analytics?.totalViews || 0,
            engagementRate: user.analytics?.engagementRate || 0,
            estimatedEarnings: user.analytics?.estimatedEarnings || 0,
          },
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update profile error:", error);

    // ✅ ALL YOUR EXISTING ERROR HANDLING STAYS THE SAME
    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(", ");
      return NextResponse.json(
        {
          success: false,
          message: messages,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
        error: error.message,
      },
      { status: 500 }
    );
  }
}