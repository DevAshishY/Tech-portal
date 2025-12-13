import { NextRequest } from "next/server";
import { POST_handler } from "./post";

export async function POST(request: NextRequest) {
  return POST_handler(request);
}
