import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  // store refresh tokens (simple approach); in production prefer hashed tokens or a separate store (Redis, DB table)
  refreshTokens: [{ token: String, createdAt: { type: Date, default: Date.now } }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
