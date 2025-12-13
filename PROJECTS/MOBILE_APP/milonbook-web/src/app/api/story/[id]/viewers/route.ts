import Story from "@/models/story";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, unauthorizedResponse } from "@/lib/authMiddleware";


export async function GET(request: NextRequest,  context: { params: Promise<{ id: string }> }) {
  try {

    const authResult = await authMiddleware(request);
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error);
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid story ID" },
        { status: 400 }
      );
    }
    const story = await Story.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }
      },

      {
        $lookup: {
          from: "users",
          localField: "viewers",
          foreignField: "_id",
          as: "viewersData",
          pipeline: [
            {
              $project: {
                name: 1,
                profilePicture: 1
              }
            }
          ]
        }
      },

      {
        $project: {
          _id: 1,
          viewCount: 1,
          viewers: "$viewersData"
        }
      }
    ]);

    if (!story || story.length === 0) {
      return NextResponse.json(
        { success: false, message: "Story not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      story: {
        viewers: story[0].viewers,
        viewCount: story[0].viewCount,
        _id: story[0]._id,
      }
    });

  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch viewers",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

