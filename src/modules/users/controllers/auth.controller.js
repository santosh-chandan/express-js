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

    // Save refresh token - simple approach: append
    user.refreshTokens.push({ token: refreshToken });
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
    if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

    // Verify refresh token
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (e) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Find user and ensure refresh token exists in DB
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "Invalid refresh token" });

    const hasToken = user.refreshTokens.some(rt => rt.token === refreshToken);
    if (!hasToken) return res.status(401).json({ message: "Refresh token revoked" });

    // Rotate: remove old refresh token and add a new one
    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);

    const newPayload = { id: user._id.toString(), email: user.email };
    const newAccessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);

    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 * body: { refreshToken }
 * or cookie: refreshToken
 * Safe for both web & mobile clients
 */
export const logout = async (req, res, next) => {
  try {
    const token = req.body.refreshToken || req.cookies.refreshToken;

    if (!token)
      return res.status(400).json({ message: "Refresh token required" });

    // Try verifying refresh token
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      // Token invalid/expired → still clear cookie & return OK
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return res.status(200).json({ message: "Logged out" });
    }

    // Remove refresh token from user's DB list
    const user = await User.findById(payload.id);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(
        (rt) => rt.token !== token
      );
      await user.save();
    }

    // Always clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
};
