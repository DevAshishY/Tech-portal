import { NextRequest } from "next/server";
import { GET_handler } from "./get";
import { POST_handler } from "./post";


export async function GET(request: NextRequest, { params }: any) {
  return GET_handler(request);
}

export async function POST(request: NextRequest) {
  return POST_handler(request);
}
