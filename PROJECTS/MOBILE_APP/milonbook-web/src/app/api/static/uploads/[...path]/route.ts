// // File: src/app/api/static/uploads/[...path]/route.ts

// import fs from "fs";
// import path from "path";
// import { NextResponse } from "next/server";

// export async function GET(
//   req: Request,
//   { params }: { params: Promise<{ path: string[] }> }
// ) {
//   // ✅ Await params before accessing properties
//   const resolvedParams = await params;
  
//   const filePath = path.join(process.cwd(), "uploads", ...resolvedParams.path);

//   if (!fs.existsSync(filePath)) {
//     return new NextResponse("File not found", { status: 404 });
//   }

//   const file = fs.readFileSync(filePath);
//   const ext = path.extname(filePath).toLowerCase();

//   const mimeTypes: Record<string, string> = {
//     ".jpg": "image/jpeg",
//     ".jpeg": "image/jpeg",
//     ".png": "image/png",
//     ".webp": "image/webp",
//     ".gif": "image/gif",
//     ".pdf": "application/pdf",
//   };

//   const mime = mimeTypes[ext] || "application/octet-stream";

//   return new NextResponse(file, {
//     headers: {
//       "Content-Type": mime,
//       "Cache-Control": "public, max-age=31536000",
//     },
//   });
// }


import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const filePath = path.join(process.cwd(), "uploads", ...resolvedParams.path);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("File not found", { status: 404 });
  }

  const file = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".avi": "video/x-msvideo",
    ".webm": "video/webm",
    ".pdf": "application/pdf",
  };

  const mime = mimeTypes[ext] || "application/octet-stream";

  return new NextResponse(file, {
    headers: {
      "Content-Type": mime,
      "Cache-Control": "public, max-age=31536000",
    },
  });
}