import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/post";
import User from "@/models/User";
import { authMiddleware, unauthorizedResponse } from "@/lib/authMiddleware";
import Like from "@/models/like";
import mongoose from "mongoose";

const BASE_URL = process.env.MEDIA_BASE_URL;

// CREATE POST
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

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

    // Create post
    const post = await Post.create({
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
    const populatedPost = await Post.findById(post._id)
      .populate("userId", "name profilePicture")
      .populate("taggedUsers", "name profilePicture");

    return NextResponse.json(
      {
        success: true,
        message: "Post created successfully",
        post: populatedPost,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create post",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET ALL POSTS (Feed)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Check auth
    const authResult = await authMiddleware(request);
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error);
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const cursor = searchParams.get("cursor");
    const category = searchParams.get("category");
    const userId = searchParams.get("userId");

    // Base query
    const query: { isActive: boolean; category?: string; userId?: string; createdAt?: { $lt: Date } } = { isActive: true };

    if (category && category !== "All") query.category = category;
    if (userId) query.userId = userId;

    // Cursor logic → createdAt < cursor
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    // Fetch posts
    const rawPosts = await Post.find(query)
      .populate("userId", "name profilePicture")
      .populate("taggedUsers", "name profilePicture")
      .sort({ createdAt: -1 })
      .limit(limit);

    // Extract postIds
    const postIds = rawPosts.map((p) => p._id);

    // Fetch likes of current user (only if userId is a valid ObjectId)
    let userLikes: { postId: mongoose.Types.ObjectId }[] = [];
    const currentUserId = authResult.user?.userId;
    if (currentUserId && mongoose.Types.ObjectId.isValid(currentUserId)) {
      userLikes = await Like.find({
        userId: currentUserId,
        postId: { $in: postIds },
      }).select("postId");
    }

    const likedPostIds = new Set(userLikes.map((l) => l.postId.toString()));

    // Format posts
    const posts = rawPosts.map((post) => {
      const obj = post.toObject();

      // Make media absolute
      if (obj.mediaUrl && !obj.mediaUrl.startsWith("http")) {
        obj.mediaUrl = BASE_URL + obj.mediaUrl;
      }
      // Add like status
      obj.isLiked = likedPostIds.has(obj._id.toString());

      return obj;
    });

    // Next cursor = last post's createdAt
    const nextCursor =
      posts.length > 0
        ? posts[posts.length - 1].createdAt.toISOString()
        : null;

    return NextResponse.json(
      {
        success: true,
        posts,
        nextCursor,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch posts",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}