import { NextRequest, NextResponse } from "next/server";
import Like from "@/models/like"
import Reel from "@/models/reel";
import Post from "@/models/post";
import Comment from "@/models/comment";
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
      postId,
      reelId,
      commentId,
    } = body;

    // Validation
    if (!postId && !reelId && !commentId) {
      return NextResponse.json(
        {
          success: false,
          message: "You must provide either a postId, reelId, or commentId.",
        },
        { status: 400 }
      );
    }

    // Check if like already exists
    const existingLike = await Like.findOne({
      userId: authResult.user?.userId,
      postId: postId || null,
      reelId: reelId || null,
      commentId: commentId || null
    });

    let action = "";

    if (existingLike) {
      // 🔥 User already liked → REMOVE LIKE
      await Like.deleteOne({ _id: existingLike._id });
      if (postId) {
        await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
      } else if (reelId) {
        await Reel.findByIdAndUpdate(reelId, { $inc: { likesCount: -1 } });
      } else if (commentId) {
        await Comment.findByIdAndUpdate(commentId, { $inc: { likesCount: -1 } });
      }
      action = "unliked";
    } else {
      // Create post
      const like = await Like.create({
        userId: authResult.user?.userId,
        postId,
        reelId,
        commentId
      });
      if (postId) {
        await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
      } else if (reelId) {
        await Reel.findByIdAndUpdate(reelId, { $inc: { likesCount: 1 } });
      } else if (commentId) {
        await Comment.findByIdAndUpdate(commentId, { $inc: { likesCount: 1 } });
      }

      action = "liked";
    }

    return NextResponse.json(
      {
        success: true,
        message: "Like created successfully",
        post: action,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Create post error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create like",
        error: error.message,
      },
      { status: 500 }
    );
  }
}