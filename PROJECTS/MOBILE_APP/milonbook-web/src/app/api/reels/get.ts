// import Reel from "@/models/reel";
// import { NextRequest, NextResponse } from "next/server";

// // import dbConnect from "@/lib/dbConnect";

// // ✅ GET ALL REELS (Feed)
// export async function GET_handler(request: NextRequest) {
//   try {
//     // await dbConnect();

//     // Get query params
//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get("page") || "1");
//     const limit = parseInt(searchParams.get("limit") || "10");
//     const category = searchParams.get("category");
//     const userId = searchParams.get("userId");

//     // Build query
//     const query: any = { isActive: true };
//     if (category && category !== "All") query.category = category;
//     if (userId) query.userId = userId;

//     // Get reels with pagination
//     const skip = (page - 1) * limit;
//     const reels = await Reel.find(query)
//       .populate("userId", "name profilePicture")
//       .populate("taggedUsers", "name profilePicture")
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     const total = await Reel.countDocuments(query);

//     return NextResponse.json(
//       {
//         success: true,
//         reels,
//         pagination: {
//           page,
//           limit,
//           total,
//           totalPages: Math.ceil(total / limit),
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Get reels error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to fetch reels",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

//Get All Reels Using Cursor 


import Reel from "@/models/reel";
import Like from "@/models/like";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, unauthorizedResponse } from "@/lib/authMiddleware";
import mongoose from "mongoose";
// Add base URL to mediaUrl
const BASE_URL = process.env.MEDIA_BASE_URL

// 🔥 GET ALL REELS (Cursor Pagination)
export async function GET_handler(request: NextRequest) {
  try {

    // Check auth
    const authResult = await authMiddleware(request);
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error);
    }

    const { searchParams } = new URL(request.url);

    const limit = parseInt(searchParams.get("limit") || "10");
    const cursor = searchParams.get("cursor");
    const category = searchParams.get("category");
    const userId = searchParams.get("userId");
    const currentUserId = authResult.user?.userId

    // Base query
    const query: any = { isActive: true };
    if (category && category !== "All") query.category = category;
    if (userId) query.userId = userId;

    // Cursor filter (createdAt < cursor)
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    // Fetch reels
    const rawReels = await Reel.find(query)
      .populate("userId", "name profilePicture")
      .populate("taggedUsers", "name profilePicture")
      .sort({ createdAt: -1 })
      .limit(limit);

    // Extract reelIds
    const reelIds = rawReels.map((r) => r._id);

    // Fetch current user's likes for these reels (only if userId is a valid ObjectId)
    let userLikes: any[] = [];
    if (currentUserId && mongoose.Types.ObjectId.isValid(currentUserId)) {
      userLikes = await Like.find({
        userId: currentUserId,
        reelId: { $in: reelIds },
      }).select("reelId");
    }

    const likedReelIds = new Set(userLikes.map((l) => l.reelId.toString()));

    // Convert to plain objects + media URL + isLiked
    const reels = rawReels.map((reel) => {
      const obj: any = reel.toObject();

      // Convert to absolute URL if needed
      if (obj.mediaUrl && !obj.mediaUrl.startsWith("http")) {
        obj.mediaUrl = BASE_URL + obj.mediaUrl;
      }

      // Add like status
      obj.isLiked = likedReelIds.has(obj._id.toString());

      return obj;
    });

    // Next cursor
    const nextCursor =
      reels.length > 0
        ? reels[reels.length - 1].createdAt.toISOString()
        : null;

    return NextResponse.json(
      {
        success: true,
        reels,
        nextCursor,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get reels error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reels",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
