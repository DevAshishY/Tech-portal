import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/post"
import User from "@/models/User";
import { authMiddleware, unauthorizedResponse } from "@/lib/authMiddleware";

// ✅ GET SINGLE POST
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const post = await Post.findById(id)
      .populate("userId", "name profilePicture bio")
      .populate("taggedUsers", "name profilePicture");

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Increment views
    await Post.findByIdAndUpdate(id, { $inc: { viewsCount: 1 } });

    return NextResponse.json(
      { success: true, post },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get post error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch post", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ UPDATE POST
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const authResult = await authMiddleware(request);
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error);
    }

    const body = await request.json();
    const { caption, category, hashtags, location } = body;

    // Find post
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (post.userId.toString() !== authResult.user?.userId) {
      return NextResponse.json(
        { success: false, message: "Not authorized to update this post" },
        { status: 403 }
      );
    }

    // Update post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        caption,
        category,
        hashtags,
        location,
      },
      { new: true, runValidators: true }
    ).populate("userId", "name profilePicture");

    return NextResponse.json(
      { success: true, message: "Post updated successfully", post: updatedPost },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update post error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update post", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE POST
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const authResult = await authMiddleware(request);
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error);
    }

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Check ownership
    // Allow admin token (userId === "admin") to delete any post
    if (authResult.user?.userId !== "admin" && post.userId.toString() !== authResult.user?.userId) {
      return NextResponse.json(
        { success: false, message: "Not authorized to delete this post" },
        { status: 403 }
      );
    }

    await Post.findByIdAndDelete(id);

    // Decrement the original post owner's moments count
    await User.findByIdAndUpdate(post.userId, {
      $inc: { momentsCount: -1 },
    });

    return NextResponse.json(
      { success: true, message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete post error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete post", error: error.message },
      { status: 500 }
    );
  }
}