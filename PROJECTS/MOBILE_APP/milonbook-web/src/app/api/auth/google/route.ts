import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

// ✅ Don't pass a specific client ID here
const client = new OAuth2Client();

// ✅ Add GET handler for testing
export async function GET(req: NextRequest) {
    return NextResponse.json({ 
        status: "ok", 
        message: "Google Auth API is working",
        timestamp: new Date().toISOString()
    });
}

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();
        
        if (!token) {
            return NextResponse.json({ error: "Token is required" }, { status: 400 });
        }

        await dbConnect();

        // ✅ Verify against ALL client IDs
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: [
                process.env.CLIENT_ID_WEB!,     // Web client
                process.env.CLIENT_ID_ANDROID_DEBUG!,
                process.env.CLIENT_ID_ANDROID!, // Android client  
                process.env.CLIENT_ID_IOS!,     // iOS client
            ],
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return NextResponse.json({ error: "Invalid Google token" }, { status: 400 });
        }

        const { email, name } = payload;

        if (!email) {
            return NextResponse.json({ error: "Email not found in Google payload" }, { status: 400 });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: name || "Google User",
                email,
                password: "google-auth",
                registerType: "google",
            });
        }

        // Create JWT token
        const authToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || "secretkey",
            { expiresIn: "7d" }
        );

        return NextResponse.json({ token: authToken, user });
    } catch (err: any) {
        console.error("Google login error:", err);
        return NextResponse.json({ 
            error: "Google login failed",
            message: err.message 
        }, { status: 500 });
    }
}
// import { NextRequest, NextResponse } from "next/server";
// import { OAuth2Client } from "google-auth-library";
// import jwt from "jsonwebtoken";
// import User from "@/models/User";
// import dbConnect from "@/lib/dbConnect";

// // ✅ Initialize OAuth2Client (can verify multiple audiences)
// const client = new OAuth2Client();

// export async function POST(req: NextRequest) {
//     try {
//         const { token } = await req.json();
//         await dbConnect();

//         // ✅ Verify token against ALL your client IDs
//         const ticket = await client.verifyIdToken({
//             idToken: token,
//             audience: [
//                 process.env.CLIENT_ID_WEB!,     // Web client
//                 process.env.CLIENT_ID_ANDROID!, // Android client
//                 process.env.CLIENT_ID_IOS!,     // iOS client (optional)
//             ],
//         });

//         const payload = ticket.getPayload();
//         if (!payload) {
//             return NextResponse.json({ error: "Invalid Google token" }, { status: 400 });
//         }

//         const { email, name } = payload;

//         if (!email) {
//             return NextResponse.json({ error: "Email not found in Google payload" }, { status: 400 });
//         }

//         let user = await User.findOne({ email });

//         if (!user) {
//             user = await User.create({
//                 name: name || "Google User",
//                 email,
//                 password: "google-auth", // dummy placeholder
//                 registerType: "google",
//             });
//         }

//         // Create JWT token
//         const authToken = jwt.sign(
//             { userId: user._id, email: user.email },
//             process.env.JWT_SECRET || "secretkey",
//             { expiresIn: "7d" }
//         );

//         return NextResponse.json({ token: authToken, user });
//     } catch (err) {
//         console.error("Google login error:", err);
//         return NextResponse.json({ error: "Google login failed" }, { status: 500 });
//     }
// }