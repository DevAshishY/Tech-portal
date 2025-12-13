// File: src/app/api/upload/media/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { authMiddleware, unauthorizedResponse } from "@/lib/authMiddleware";

// ⏱ Increase execution time (important on Vercel serverless)
// ⏱ Extend runtime execution for uploads
export const maxDuration = 60;

// 🆕 Allowed file size for uploads
export const maxBodySize = "50mb"; 

// 🔥 Force server execution (NO static optimization)
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { success: false, message: "Invalid content type" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("media") as File;

    const authResult = await authMiddleware(req);
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error);
    }

    const user_id =  authResult.user?.userId
    // const user_id = formData.get("user_id");

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

    // 📌 Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Only images and videos are allowed" },
        { status: 400 }
      );
    }

    // 📌 Validate size
    const isVideo = file.type.startsWith("video/");
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: `File size must be less than ${isVideo ? "50MB" : "10MB"}`,
        },
        { status: 400 }
      );
    }

       // 📌 Save to uploads folder
    const mediaType = isVideo ? "videos" : "images";
    const baseDir = path.join(process.cwd(), "uploads", mediaType);

    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    const userDir = path.join(baseDir, user_id.toString());

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(userDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${mediaType}/${user_id}/${fileName}`,
      type: isVideo ? "video" : "image",
    });
  } catch (error: any) {
    console.error("MEDIA UPLOAD ERROR:", error);

    if (error.message?.includes("Body exceeded")) {
      return NextResponse.json(
        { success: false, message: "File too large. Try a smaller file." },
        { status: 413 }
      );
    }

    return NextResponse.json(
      { success: false, message: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
