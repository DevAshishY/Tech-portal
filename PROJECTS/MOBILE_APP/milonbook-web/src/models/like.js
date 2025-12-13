// models/like.ts
import mongoose, { Schema, model } from "mongoose";

const LikeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: [true, "userId is required"], index: true },
  postId: { type: Schema.Types.ObjectId, ref: "Post", index: true },
  reelId: { type: Schema.Types.ObjectId, ref: "Reel", index: true },
  commentId: { type: Schema.Types.ObjectId, ref: "Comment", index: true },
}, { timestamps: true });

LikeSchema.index({ userId: 1, postId: 1 }, { unique: true, partialFilterExpression: { postId: { $exists: true } } });
// you can create compound unique constraints per-target-type
export default mongoose.models.Like || model("Like", LikeSchema);