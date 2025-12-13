import Reel from "@/models/reel";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, unauthorizedResponse } from "@/lib/authMiddleware";

export async function POST_handler(request: NextRequest) {
  try {
    
    // Check auth
    const authResult = await authMiddleware(request);
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error);
    }

    // Parse request body
    const body = await request.json();
    const {
      caption,
      mediaUrl,
      mediaType,
      category,
      hashtags,
      taggedUsers,
      location,
    } = body;

    // Validation
    if (!mediaUrl || !mediaType) {
      return NextResponse.json(
        {
          success: false,
          message: "Media URL and type are required",
        },
        { status: 400 }
      );
    }

    if (!["image", "video"].includes(mediaType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid media type. Must be 'image' or 'video'",
        },
        { status: 400 }
      );
    }

    // Create reel
    const reel = await Reel.create({
      userId: authResult.user?.userId,
      caption,
      mediaUrl,
      mediaType,
      category: category || "Other",
      hashtags: hashtags || [],
      taggedUsers: taggedUsers || [],
      location: location || null,
    });

    // Update user's moments count
    await User.findByIdAndUpdate(authResult.user?.userId, {
      $inc: { momentsCount: 1 },
    });

    // Populate user data
    const populatedReel = await Reel.findById(reel._id)
      .populate("userId", "name profilePicture")
      .populate("taggedUsers", "name profilePicture");

    return NextResponse.json(
      {
        success: true,
        message: "Reel created successfully",
        reel: populatedReel,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Create reel error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create reel",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
