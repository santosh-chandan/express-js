import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  token: String,
  userAgent: String,
  ip: String,
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: null }, 
  // store refresh tokens (simple approach); in production prefer hashed tokens or a separate store (Redis, DB table)
  // refreshTokens: [{ token: String, createdAt: { type: Date, default: Date.now } }]
  refreshTokens: [refreshTokenSchema],
}, { timestamps: true });

export default mongoose.model("User", userSchema);
