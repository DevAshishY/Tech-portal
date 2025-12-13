import Story from "@/models/story";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, unauthorizedResponse } from "@/lib/authMiddleware";
import mongoose from "mongoose";

export async function GET_handler(request: NextRequest) {
    try {
        // Auth Check
        const authResult = await authMiddleware(request);
        if (!authResult.authorized) {
            return unauthorizedResponse(authResult.error);
        }

        const { searchParams } = new URL(request.url);

        const limit = parseInt(searchParams.get("limit") || "10");
        const cursor = searchParams.get("cursor");
        const userId = searchParams.get("userId");

        const now = new Date();

        const matchQuery: any = {
            expiresAt: { $gt: now },
        };

        if (userId) {
            try {
                matchQuery.userId = new mongoose.Types.ObjectId(userId);
            } catch {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid userId parameter",
                    },
                    { status: 400 }
                );
            }
        }

        if (cursor) {
            matchQuery.createdAt = { $lt: new Date(cursor) };
        }

        // Aggregation Pipeline
        const stories = await Story.aggregate([
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

            {
                $project: {
                    _id: 1,
                    mediaUrl: 1,
                    mediaType: 1,
                    caption: 1,
                    privacy: 1,
                    createdAt: 1,
                    expiresAt: 1,
                    viewCount: 1,
                    viewers: 1,
                    userId: {
                        _id: "$userData._id",
                        name: "$userData.name",
                        profilePicture: "$userData.profilePicture",
                    },
                },
            }
        ]);

        const nextCursor =
            stories.length > 0
                ? stories[stories.length - 1].createdAt.toISOString()
                : null;

        return NextResponse.json(
            { success: true, stories, nextCursor },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Story feed error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch stories",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
