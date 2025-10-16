// src/modules/comments/models/comment.model.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: String,
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" }, // join with Blog
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }  // join with User
});

export default mongoose.model("Comment", commentSchema);
