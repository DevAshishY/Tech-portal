import Story from "@/models/story";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, unauthorizedResponse } from "@/lib/authMiddleware";
import mongoose from "mongoose";

export async function POST_handler(request: NextRequest, params: { id: string }) {
  try {
    const { id } = params;

    // Auth Check
    const authResult = await authMiddleware(request);
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error);
    }

    const userId = new mongoose.Types.ObjectId(authResult.user?.userId);

    const result = await Story.updateOne(
      {
        _id: id,
        viewers: { $ne: userId } 
      },
      {
        $addToSet: { viewers: userId },
        $inc: { viewCount: 1 }
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: result.modifiedCount > 0
          ? "View recorded"
          : "Already viewed",
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Story view error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to record story view",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
