import Highlight from "@/models/storyHighlight";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, unauthorizedResponse } from "@/lib/authMiddleware";

export async function POST_handler(request: NextRequest) {

  try {
    const authResult = await authMiddleware(request);
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error);
    }

    const userId = authResult.user?.userId;
    const {title, storyIds } = await request.json();

    if (!userId || !title) {
      return NextResponse.json(
        { success: false, message: "userId and title are required" },
        { status: 400 }
      );
    }
    const highlight = await Highlight.create({
      userId,
      title,
      stories: storyIds,
    });

    return NextResponse.json(
      { success: true, highlight },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Highlight creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create highlight",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
