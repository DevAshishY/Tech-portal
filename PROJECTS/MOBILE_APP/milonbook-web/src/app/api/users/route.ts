import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";

// Utility to safely extract error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "Server error";
};

// GET - Fetch all users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    // GET user by ID
    if (id) {
      const user = await User.findById(id).select("-password");

      if (!user) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: true, data: user },
        { status: 200 }
      );
    }

    // GET all users
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: users.length,
        data: users,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// DELETE - Delete user by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
        data: user,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}