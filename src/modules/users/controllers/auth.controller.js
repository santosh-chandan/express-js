import bcrypt from "bcryptjs";
import User from "#users/models/user.model.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../../utils/jwt.js";

/**
 * POST /api/auth/login
 * body: { email, password }
 * returns: { accessToken, refreshToken }
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: user._id.toString(), email: user.email };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Get device info
    const userAgent = req.headers["user-agent"] || "unknown";
    const ip = req.headers["x-forwarded-for"] || req.ip;

    // Remove any old token for same device/user-agent
    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt.userAgent !== userAgent
    );

    // // Save refresh token - simple approach: append
    // user.refreshTokens.push({ token: refreshToken });
    // await user.save();

    // Add new one
    user.refreshTokens.push({ token: refreshToken, userAgent, ip });
    await user.save();

    // Return tokens (you can also set refresh token in httpOnly cookie)
    // res.json({ accessToken, refreshToken });

    // For web: set cookie
    if (req.headers["user-agent"].includes("Mozilla")) {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    // For mobile: send in response
    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken, // mobile clients store securely
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/refresh
 * body: { refreshToken }
 * returns: { accessToken, refreshToken }  (rotates refresh token)
 */
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token required" });

    // Verify refresh token
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    // Find user
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    // Match stored refresh token
    const storedToken = user.refreshTokens.find((rt) => rt.token === refreshToken);
    if (!storedToken)
      return res.status(401).json({ message: "Refresh token revoked or not recognized" });

    // Rotate token
    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt.token !== refreshToken
    );

    const newPayload = { id: user._id.toString(), email: user.email };
    const newAccessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);

    // Keep same device info
    user.refreshTokens.push({
      token: newRefreshToken,
      userAgent: storedToken.userAgent,
      ip: req.headers["x-forwarded-for"] || req.ip,
      createdAt: new Date(),
    });

    await user.save();

    // If refresh came from a browser, also rotate cookie
    if (storedToken.userAgent.includes("Mozilla")) {
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    return res.json({
      message: "Token refreshed",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 * body: { refreshToken }
 * or cookie: refreshToken
 */
export const logout = async (req, res, next) => {
  try {
    const token = req.body.refreshToken || req.cookies.refreshToken;
    if (!token)
      return res.status(400).json({ message: "Refresh token required" });

    const userAgent = req.headers["user-agent"] || "unknown";

    // Try verifying refresh token
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      // Token invalid/expired → still clear cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return res.status(200).json({ message: "Logged out (token invalid/expired)" });
    }

    // Remove refresh token only for this device/user-agent
    const user = await User.findById(payload.id);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(
        (rt) => rt.token !== token && rt.userAgent !== userAgent
      );
      await user.save();
    }

    // Clear cookie (for web)
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};
