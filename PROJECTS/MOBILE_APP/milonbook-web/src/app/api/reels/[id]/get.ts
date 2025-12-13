import Reel from "@/models/reel";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET_handler(
  request: NextRequest,
  params: { id: string }
) {
  try {
    await dbConnect();
    const { id } = params;

    const reel = await Reel.findById(id)
      .populate("userId", "name profilePicture bio")
      .populate("taggedUsers", "name profilePicture");

    if (!reel) {
      return NextResponse.json(
        { success: false, message: "Reel not found" },
        { status: 404 }
      );
    }

    await Reel.findByIdAndUpdate(id, { $inc: { viewsCount: 1 } });

    return NextResponse.json(
      { success: true, reel },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get reel error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reel", error: error.message },
      { status: 500 }
    );
  }
}
