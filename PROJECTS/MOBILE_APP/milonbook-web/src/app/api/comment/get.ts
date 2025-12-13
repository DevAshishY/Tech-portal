import Comment from "@/models/comment";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/authMiddleware";
import mongoose from "mongoose";

export async function GET_handler(request: NextRequest) {
    try {
        // Try to resolve logged-in user, but don't block if missing/invalid token
        let currentUserId: string | null = null;
        const userAuth = await authMiddleware(request);
        if (userAuth.authorized && userAuth.user?.userId && userAuth.user.userId !== "admin") {
            currentUserId = userAuth.user.userId;
        }

        const { searchParams } = new URL(request.url);

        const postId = searchParams.get("postId");
        const reelId = searchParams.get("reelId");
        const limit = parseInt(searchParams.get("limit") || "10");
        const cursor = searchParams.get("cursor");

        // At least one must be provided
        if (!postId && !reelId) {
            return NextResponse.json(
                { success: false, message: "postId or reelId is required" },
                { status: 400 }
            );
        }

        // Build match object dynamically
        const matchQuery: any = {
            isActive: true,
            ...(postId && { postId: new mongoose.Types.ObjectId(postId) }),
            ...(reelId && { reelId: new mongoose.Types.ObjectId(reelId) }),
            ...(cursor && { createdAt: { $lt: new Date(cursor) } }),
        };

        // AGGREGATION PIPELINE
        const pipeline: any[] = [
            { $match: matchQuery },

            { $sort: { createdAt: -1 } },

            { $limit: limit },

            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData",
                    pipeline: [
                        { $project: { name: 1, profilePicture: 1 } }
                    ]
                }
            },

            { $unwind: "$userData" },
        ];

        // LIKE STATUS ONLY FOR LOGGED-IN USER FLOW
        if (currentUserId) {
            pipeline.push(
                {
                    $lookup: {
                        from: "likes",
                        let: { commentId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$commentId", "$$commentId"] },
                                            { $eq: ["$userId", new mongoose.Types.ObjectId(currentUserId)] }
                                        ]
                                    }
                                }
                            },
                            { $limit: 1 }
                        ],
                        as: "likeData"
                    }
                },
                {
                    $addFields: {
                        isLiked: { $gt: [{ $size: "$likeData" }, 0] }
                    }
                },
            );
        }

        pipeline.push({
            $project: {
                _id: 1,
                text: 1,
                createdAt: 1,
                isLiked: { $ifNull: ["$isLiked", false] },
                likesCount: 1,
                user: {
                    _id: "$userData._id",
                    name: "$userData.name",
                    profilePicture: "$userData.profilePicture",
                }
            }
        });

        const rawComments = await Comment.aggregate(pipeline);

        // NEXT CURSOR
        const nextCursor =
            rawComments.length > 0
                ? rawComments[rawComments.length - 1].createdAt.toISOString()
                : null;

        return NextResponse.json(
            {
                success: true,
                comments: rawComments,
                nextCursor,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Get comments error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch comments",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
