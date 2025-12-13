
// import mongoose from "mongoose";
// import { hashPassword, comparePassword, generateAuthToken } from "../utils/auth.ts";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//       minlength: [2, "Name must be at least 2 characters long"],
//       maxlength: [50, "Name cannot exceed 50 characters"],
//     },
//     email: {
//       type: String,
//       unique: true,
//       sparse: true,
//       lowercase: true,
//       trim: true,
//       match: [
//         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//         "Please enter a valid email",
//       ],
//     },
//     phone: {
//       type: String,
//       unique: true,
//       sparse: true,
//       trim: true,
//       match: [
//         /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
//         "Please enter a valid phone number",
//       ],
//     },
//     password: {
//       type: String,
//       required: function () {
//         return this.registerType === "email" || this.registerType === "phone";
//       },
//       minlength: [6, "Password must be at least 6 characters long"],
//       select: false,
//     },
//     registerType: {
//       type: String,
//       enum: ["email", "phone", "google", "facebook"],
//       required: [true, "Register type is required"],
//       default: "email",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // 🔐 Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   try {
//     this.password = await hashPassword(this.password);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // 🔍 Compare passwords
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await comparePassword(candidatePassword, this.password);
// };

// // 🎟️ Generate JWT token
// userSchema.methods.generateAuthToken = function () {
//   return generateAuthToken({
//     userId: this._id,
//     email: this.email,
//     phone: this.phone,
//     registerType: this.registerType,
//   });
// };

// const User = mongoose.models.User || mongoose.model("User", userSchema);
// export default User;
import mongoose from "mongoose";
import { hashPassword, comparePassword, generateAuthToken } from "../utils/auth";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      match: [
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        "Please enter a valid phone number",
      ],
    },

    password: {
      type: String,
      required: function () {
        return this.registerType === "email" || this.registerType === "phone";
      },
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },

    registerType: {
      type: String,
      enum: ["email", "phone", "google", "facebook"],
      required: true,
      default: "email",
    },

    // Profile Fields (matching your UI)
    profilePicture: {
      type: String,
      default: "https://i.pravatar.cc/300?img=1",
    },

    bio: {
      type: String,
      trim: true,
      default: "",
      maxlength: [200, "Bio cannot exceed 200 characters"],
    },

    gender: {
      type: String,
      enum: ["Female", "Male", "Other", "Prefer not to say", ""],
      default: "",
    },

    // Stats (matching your UI: Moments, Connections, Connecting)
    momentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    connectionsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    connectingCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Creator Analytics (matching your UI)
    analytics: {
      totalViews: {
        type: Number,
        default: 0,
      },
      engagementRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      estimatedEarnings: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

// 🔍 Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await comparePassword(candidatePassword, this.password);
};

// 🎟️ Generate JWT token
userSchema.methods.generateAuthToken = function () {
  return generateAuthToken({
    userId: this._id,
    email: this.email,
    phone: this.phone,
    registerType: this.registerType,
  });
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
