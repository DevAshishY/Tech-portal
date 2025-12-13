import Story from "@/models/story";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, params : { id: string }) {
  const {id} = params

  await Story.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
