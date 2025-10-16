import jwt from "jsonwebtoken";
import env from "../config/env.js";
import User from "#users/models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // verify using access secret
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || env.jwtAccessSecret);
    // attach user minimal info; optionally fetch full user from DB
    const user = await User.findById(decoded.id).select("-password -refreshTokens");
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = { id: user._id.toString(), email: user.email, name: user.name };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
