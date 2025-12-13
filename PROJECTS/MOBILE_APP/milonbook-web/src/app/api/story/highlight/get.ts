import Highlight from "@/models/storyHighlight";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, unauthorizedResponse } from "@/lib/authMiddleware";
import mongoose from "mongoose";

export async function GET_handler(request: NextRequest) {
  try {

    const authResult = await authMiddleware(request);
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error);
    }

    const userId = authResult.user?.userId;
    const highlights = await Highlight.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },

      // Lookup: fetch stories linked to highlight
      {
        $lookup: {
          from: "stories",
          localField: "stories",
          foreignField: "_id",
          as: "stories",
          pipeline: [
            {
              $project: {
                _id: 1,
                mediaUrl: 1,
                createdAt: 1,
                viewCount: 1,
                viewers: 1,
                expiresAt: 1,
              },
            },
          ],
        },
      },

      // Final output formatting
      {
        $project: {
          _id: 1,
          title: 1,
          stories: 1,
          createdAt: 1,
        },
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        highlights,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Get highlights error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch highlights",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

