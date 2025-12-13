import { NextRequest } from "next/server";
import { POST_handler } from "./post";
import { DELETE_handler } from "./delete";
import { GET_handler } from "./get";

export async function POST(request: NextRequest) {
  return POST_handler(request);
}

export async function DELETE(request: NextRequest, { params }: any) {
  return DELETE_handler(request);
}

export async function GET(request: NextRequest, { params }: any) {
  return GET_handler(request);
}