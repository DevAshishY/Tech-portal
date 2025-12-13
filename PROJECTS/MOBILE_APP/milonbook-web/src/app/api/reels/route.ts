import { NextRequest } from "next/server";
import { GET_handler } from "./get";
import { POST_handler } from "./post";

// import Post from "../../../models/post";


export async function POST(request: NextRequest) {
  return POST_handler(request);
}

export async function GET(request: NextRequest) {
  return GET_handler(request);
}
