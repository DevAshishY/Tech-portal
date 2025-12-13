// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import User from "@/models/User";
// import validator from "validator";
// import { RegisterRequest } from "@/types/auth";

// export async function POST(request: NextRequest) {
//   try {
//     // Connect to database
//     await dbConnect();

//     // Parse request body
//     const body: RegisterRequest = await request.json();
//     const { name, email, phone, password } = body;

//     // Validation - Name and Password are required
//     if (!name || !password) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Name and password are required",
//         },
//         { status: 400 }
//       );
//     }

//     // Either email OR phone must be provided
//     if (!email && !phone) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Please provide either email or phone number",
//         },
//         { status: 400 }
//       );
//     }

//     // Don't allow both email and phone
//     if (email && phone) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Please provide either email or phone number, not both",
//         },
//         { status: 400 }
//       );
//     }

//     // Validate name
//     if (name.trim().length < 2 || name.trim().length > 50) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Name must be between 2 and 50 characters",
//         },
//         { status: 400 }
//       );
//     }

//     // Validate email format (if provided)
//     if (email && !validator.isEmail(email)) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Please provide a valid email address",
//         },
//         { status: 400 }
//       );
//     }

//     // Validate phone number (if provided)
//     if (phone) {
//       const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
//       if (!phoneRegex.test(phone)) {
//         return NextResponse.json(
//           {
//             success: false,
//             message: "Please provide a valid phone number",
//           },
//           { status: 400 }
//         );
//       }
//     }

//     // Check password length
//     if (password.length < 6) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Password must be at least 6 characters long",
//         },
//         { status: 400 }
//       );
//     }

//     // Check if user already exists (check by email or phone)
//     let existingUser = null;
//     if (email) {
//       existingUser = await User.findOne({ email: email.toLowerCase() });
//       if (existingUser) {
//         return NextResponse.json(
//           {
//             success: false,
//             message: "User with this email already exists",
//           },
//           { status: 409 }
//         );
//       }
//     }
    
//     if (phone) {
//       existingUser = await User.findOne({ phone: phone.trim() });
//       if (existingUser) {
//         return NextResponse.json(
//           {
//             success: false,
//             message: "User with this phone number already exists",
//           },
//           { status: 409 }
//         );
//       }
//     }

//     // Create new user
//    const userData = {
//   name: name.trim(),
//   password,
//   ...(email && { email: email.toLowerCase(), registerType: "email" }),
//   ...(phone && { phone: phone.trim(), registerType: "phone" }),
// };

//     const user = await User.create(userData);

//     // Generate token using model method
//     const token = user.generateAuthToken();

//     // Return user data (without password)
//     return NextResponse.json(
//       {
//         success: true,
//         message: "User registered successfully",
//           user: {
//             id: user._id.toString(),
//             name: user.name,
//             ...(user.email && { email: user.email }),
//             ...(user.phone && { phone: user.phone }),
//             createdAt: user.createdAt,
//           },
//           token,
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Registration error:", error);

//     // Handle duplicate key error
//     if (error.code === 11000) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "User with this email already exists",
//         },
//         { status: 409 }
//       );
//     }

//     // Handle validation errors
//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors)
//         .map((err: any) => err.message)
//         .join(", ");
//       return NextResponse.json(
//         {
//           success: false,
//           message: messages,
//         },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Server error during registration",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import validator from "validator";
import { RegisterRequest } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Parse request body
    const body: RegisterRequest = await request.json();
    const { name, email, phone, password } = body;
    const checkOnly = (body as any)?.checkOnly;

    // ✅ CHECK ONLY MODE - Just verify if user exists
    if (checkOnly) {
      // Check if user already exists (check by email or phone)
      if (email) {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
          return NextResponse.json(
            {
              success: false,
              message: "User with this email already exists",
            },
            { status: 409 }
          );
        }
      }
      
      if (phone) {
        const existingUser = await User.findOne({ phone: phone.trim() });
        if (existingUser) {
          return NextResponse.json(
            {
              success: false,
              message: "User with this phone number already exists",
            },
            { status: 409 }
          );
        }
      }

      // User doesn't exist
      return NextResponse.json(
        {
          success: true,
          checkOnly: true,
          message: "User not found - can proceed with registration",
        },
        { status: 200 }
      );
    }

    // ✅ NORMAL REGISTRATION MODE
    // Validation - Name and Password are required
    if (!name || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and password are required",
        },
        { status: 400 }
      );
    }

    // Either email OR phone must be provided
    if (!email && !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide either email or phone number",
        },
        { status: 400 }
      );
    }

    // Don't allow both email and phone
    if (email && phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide either email or phone number, not both",
        },
        { status: 400 }
      );
    }

    // Validate name
    if (name.trim().length < 2 || name.trim().length > 50) {
      return NextResponse.json(
        {
          success: false,
          message: "Name must be between 2 and 50 characters",
        },
        { status: 400 }
      );
    }

    // Validate email format (if provided)
    if (email && !validator.isEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address",
        },
        { status: 400 }
      );
    }

    // Validate phone number (if provided)
    if (phone) {
      const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(phone)) {
        return NextResponse.json(
          {
            success: false,
            message: "Please provide a valid phone number",
          },
          { status: 400 }
        );
      }
    }

    // Check password length
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    // Check if user already exists (check by email or phone)
    let existingUser = null;
    if (email) {
      existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return NextResponse.json(
          {
            success: false,
            message: "User with this email already exists",
          },
          { status: 409 }
        );
      }
    }
    
    if (phone) {
      existingUser = await User.findOne({ phone: phone.trim() });
      if (existingUser) {
        return NextResponse.json(
          {
            success: false,
            message: "User with this phone number already exists",
          },
          { status: 409 }
        );
      }
    }

    // Create new user
   const userData = {
  name: name.trim(),
  password,
  ...(email && { email: email.toLowerCase(), registerType: "email" }),
  ...(phone && { phone: phone.trim(), registerType: "phone" }),
};

    const user = await User.create(userData);

    // Generate token using model method
    const token = user.generateAuthToken();

    // Return user data (without password)
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
          user: {
            id: user._id.toString(),
            name: user.name,
            ...(user.email && { email: user.email }),
            ...(user.phone && { phone: user.phone }),
            createdAt: user.createdAt,
          },
          token,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "User with this email already exists",
        },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(", ");
      return NextResponse.json(
        {
          success: false,
          message: messages,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Server error during registration",
        error: error.message,
      },
      { status: 500 }
    );
  }
}