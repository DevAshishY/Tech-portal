import { NextRequest } from "next/server";
import { DELETE_handler } from "./delete";
import { GET_handler } from "./get";
import { PATCH_handler } from "./patch";

// import Post from "../../../../models/post";

export async function GET(request: NextRequest, { params }: any) {
  return GET_handler(request, await params);
}

export async function PATCH(request: NextRequest, { params }: any) {
  return PATCH_handler(request, await params);
}

export async function DELETE(request: NextRequest, { params }: any) {
  return DELETE_handler(request, await params);
}

