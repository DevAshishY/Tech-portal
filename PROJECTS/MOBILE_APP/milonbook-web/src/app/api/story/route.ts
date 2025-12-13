import { NextRequest } from "next/server";
import { POST_handler } from "./post";
import { GET_handler } from "./get";

export async function POST(request: NextRequest) {
  return POST_handler(request);
}

export async function GET(request: NextRequest) {
  return GET_handler(request);
}