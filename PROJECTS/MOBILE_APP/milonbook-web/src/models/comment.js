// models/comment.ts
import mongoose, { Schema, model } from "mongoose";

const CommentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: [true, "userId is required"] },
  postId: { type: Schema.Types.ObjectId, ref: "Post" },
  reelId: { type: Schema.Types.ObjectId, ref: "Reel" },
  parentCommentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
  text: { type: String, required: true },
  likesCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

CommentSchema.index({ postId: 1 });
CommentSchema.index({ reelId: 1 });
export default mongoose.models.Comment || model("Comment", CommentSchema);
