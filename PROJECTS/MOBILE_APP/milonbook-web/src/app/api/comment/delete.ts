import Reel from "@/models/reel";
import Post from "@/models/post";
import Comment from "@/models/comment";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, unauthorizedResponse } from "@/lib/authMiddleware";

export async function DELETE_handler(
    request: NextRequest,
    // params: { id: string }
) {
    try {
        // const { id } = params;
        const id = request.nextUrl.searchParams.get("id");

        const authResult = await authMiddleware(request);
        if (!authResult.authorized) {
            return unauthorizedResponse(authResult.error);
        }

        const comment = await Comment.findById(id);
        if (!comment) {
            return NextResponse.json(
                { success: false, message: "Comment not found" },
                { status: 404 }
            );
        }

        if (comment.userId.toString() !== authResult.user?.userId) {
            return NextResponse.json(
                { success: false, message: "Not authorized" },
                { status: 403 }
            );
        }

        await Comment.findByIdAndDelete(id);

        if (comment.postId) {
            await Post.findByIdAndUpdate(comment.postId, { $inc: { likesCount: -1 } });
        } else if (comment.reelId) {
            await Reel.findByIdAndUpdate(comment.reelId, { $inc: { likesCount: -1 } });
        } else if (comment.parentCommentId) {
            // await Comment.findByIdAndUpdate(comment.parentCommentId, { $inc: { likesCount: -1 } });
        }

        return NextResponse.json(
            { success: true, message: "Comment deleted" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Delete Comment error:", error);
        return NextResponse.json(
            { success: false, message: "Comment to delete", error: error.message },
            { status: 500 }
        );
    }
}
