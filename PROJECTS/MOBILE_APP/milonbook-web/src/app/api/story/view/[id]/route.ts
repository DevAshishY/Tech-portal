import { NextRequest } from "next/server";
import { POST_handler } from "./post";

export async function POST(request: NextRequest, { params }: any) {
  return POST_handler(request, await params);
}