import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import { authMiddleware, unauthorizedResponse } from "@/lib/authMiddleware";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    const authResult = await authMiddleware(req);
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error);
    }

    const user_id = authResult.user?.userId

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!user_id) {
      return NextResponse.json(
        { success: false, message: "user_id is required" },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    const baseDir = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);

    const userDir = path.join(baseDir, user_id.toString());

     if (!fs.existsSync(userDir)) {
          fs.mkdirSync(userDir, { recursive: true });
        }

    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(userDir, fileName);

    fs.writeFileSync(filePath, bytes);

    return NextResponse.json({
      success: true,
      url: `/uploads/${user_id}/${fileName}`,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}
