import Story from "@/models/story";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, unauthorizedResponse } from "@/lib/authMiddleware";

export async function POST_handler(request: NextRequest) {
    try {
        // 1. Auth Check
        const authResult = await authMiddleware(request);
        if (!authResult.authorized) {
            return unauthorizedResponse(authResult.error);
        }

        const userId = authResult.user?.userId;
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Invalid user" },
                { status: 401 }
            );
        }

        // 2. Parse Body
        const body = await request.json();
        const { mediaUrl, mediaType, caption, privacy } = body;

        // 3. Validation
        if (!mediaUrl || !mediaType) {
            return NextResponse.json(
                { success: false, message: "mediaUrl & mediaType are required." },
                { status: 400 }
            );
        }

        const allowedTypes = ["image", "video"];
        if (!allowedTypes.includes(mediaType)) {
            return NextResponse.json(
                { success: false, message: "Invalid mediaType. Use image or video." },
                { status: 400 }
            );
        }

        // 4. Auto Expiry (24 hours)
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // 5. Create Story
        const story = await Story.create({
            userId,
            mediaUrl,
            mediaType,
            caption: caption?.slice(0, 200), // limit caption
            privacy: privacy || "public",
            expiresAt
        });

        return NextResponse.json(
            {
                success: true,
                message: "Story created successfully",
                story,
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Create story error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create story",
                error: error.message,
            },
            { status: 500 }
        );
    }
}



// import Story from "@/models/story";
// import { NextRequest, NextResponse } from "next/server";
// import { authMiddleware, unauthorizedResponse } from "@/lib/authMiddleware";

// export async function POST_handler(request: NextRequest) {
//     try {

//         // Check auth
//         const authResult = await authMiddleware(request);
//         if (!authResult.authorized) {
//             return unauthorizedResponse(authResult.error);
//         }

//         const body = await request.json();
//         const {
//             mediaUrl,
//             mediaType,
//             caption,
//             privacy
//         } = body;

//         const story = await Story.create({
//             userId: authResult.user?.userId,
//             mediaUrl,
//             mediaType,
//             caption,
//             privacy: privacy || "public"
//         });

//         return NextResponse.json(
//             {
//                 success: true,
//                 message: "Story created successfully",
//                 story: story,
//             },
//             { status: 200 }
//         );

//     } catch (error: any) {
//         console.error("Create story error:", error);
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: "Failed to create story",
//                 error: error.message,
//             },
//             { status: 500 }
//         );
//     }
// }
