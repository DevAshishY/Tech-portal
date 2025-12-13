import Reel from "@/models/reel";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, unauthorizedResponse } from "@/lib/authMiddleware";

// import User from "@/models/User";

export async function PATCH_handler(
  request: NextRequest,
  params: { id: string }
) {
  try {
    await dbConnect();
    const { id } = params;

    const authResult = await authMiddleware(request);
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error);
    }

    const body = await request.json();
    const { caption, category, hashtags, location } = body;

    const reel = await Reel.findById(id);
    if (!reel) {
      return NextResponse.json(
        { success: false, message: "Reel not found" },
        { status: 404 }
      );
    }

    if (reel.userId.toString() !== authResult.user?.userId) {
      return NextResponse.json(
        { success: false, message: "Not authorized to update" },
        { status: 403 }
      );
    }

    const updatedreel = await Reel.findByIdAndUpdate(
      id,
      { caption, category, hashtags, location },
      { new: true, runValidators: true }
    ).populate("userId", "name profilePicture");

    return NextResponse.json(
      { success: true, message: "Reel updated", reel: updatedreel },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update reel error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update reel", error: error.message },
      { status: 500 }
    );
  }
}
