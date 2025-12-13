import mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ["image", "video"], required: true },
  caption: { type: String },

  createdAt: { type: Date, default: Date.now },
  expiresAt: { 
    type: Date, 
    default: () => Date.now() + 24 * 60 * 60 * 1000  // 24 hours
  },

  viewers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  viewCount: { type: Number, default: 0 },

  privacy: {
    type: String,
    enum: ["public", "followers", "close_friends", "custom"],
    default: "public"
  },
  allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

export default mongoose.models.Story || mongoose.model("Story", StorySchema);
