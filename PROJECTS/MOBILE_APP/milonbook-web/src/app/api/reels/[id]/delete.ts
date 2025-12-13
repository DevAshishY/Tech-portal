import Reel from "@/models/reel";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, unauthorizedResponse } from "@/lib/authMiddleware";

// import dbConnect from "@/lib/dbConnect";

export async function DELETE_handler(
  request: NextRequest,
  params: { id: string }
) {
  try {
    // await dbConnect();
    const { id } = params;

    const authResult = await authMiddleware(request);
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error);
    }

    const reel = await Reel.findById(id);
    if (!reel) {
      return NextResponse.json(
        { success: false, message: "Reel not found" },
        { status: 404 }
      );
    }

    // Allow admin token (userId === "admin") to delete any reel
    if (authResult.user?.userId !== "admin" && reel.userId.toString() !== authResult.user?.userId) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    await Reel.findByIdAndDelete(id);

    // Decrement the original reel owner's moments count
    await User.findByIdAndUpdate(reel.userId, {
      $inc: { momentsCount: -1 },
    });

    return NextResponse.json(
      { success: true, message: "Reel deleted" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete reel error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete", error: error.message },
      { status: 500 }
    );
  }
}
