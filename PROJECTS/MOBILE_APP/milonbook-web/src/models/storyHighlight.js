import mongoose from "mongoose";

const HighlightSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },

  stories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Story"
  }],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.StoryHighlight ||
  mongoose.model("StoryHighlight", HighlightSchema);
