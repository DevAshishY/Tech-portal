import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    // Author Info
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Content
    caption: {
      type: String,
      trim: true,
      maxlength: [2200, "Caption cannot exceed 2200 characters"],
      default: "",
    },

    // Media (photo or video)
    mediaUrl: {
      type: String,
      required: [true, "Media is required"],
    },

    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },

    // Category
    category: {
      type: String,
      enum: ["Sad", "Funny", "Inspirational", "Educational", "Entertainment", "Sports", "Travel", "Lifestyle", "Food", "Fashion", "Technology", "Other"],
      default: "Other",
    },

    // Hashtags
    hashtags: [{
      type: String,
      trim: true,
    }],

    // Tagged Users
    taggedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],

    // Location
    location: {
      name: {
        type: String,
        trim: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: "2dsphere",
      },
    },

    // Engagement Stats
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    sharesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    viewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },

    isReported: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ createdAt: -1 });

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;
