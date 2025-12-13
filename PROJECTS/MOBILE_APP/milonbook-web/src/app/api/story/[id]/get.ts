import Story from "@/models/story";
import { NextRequest, NextResponse } from "next/server";

export async function GET_handler(request: NextRequest,
  params: { id: string }) {
  const { id } = params;

  const story = await Story.findById(id)
    .populate("userId", "name profilePicture");

  return NextResponse.json({ story });
}
