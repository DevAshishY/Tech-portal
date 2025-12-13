import { NextRequest, NextResponse } from "next/server";
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
            parentCommentId,
            text,
        } = body;

        // Validation
        if (!postId && !reelId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You must provide either a postId, reelId",
                },
                { status: 400 }
            );
        }
        // Create comment
        const comment = await Comment.create({
            userId: authResult.user?.userId,
            postId,
            reelId,
            parentCommentId,
            text,
        });
        if (postId) {
            await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
        } else if (reelId) {
            await Reel.findByIdAndUpdate(reelId, { $inc: { commentsCount: 1 } });
        } else if (parentCommentId) {
            // await Comment.findByIdAndUpdate(commentId, { $inc: { subCommentCount: 1 } });
        }

        return NextResponse.json(
            {
                success: true,
                message: "Comment created successfully",
                comment: comment,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Comment post error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create comment",
                error: error.message,
            },
            { status: 500 }
        );
    }
}