import jwt from "jsonwebtoken";
import env from "../config/env.js";

const accessSecret = process.env.JWT_ACCESS_SECRET || env.jwtAccessSecret || "access_secret";
const refreshSecret = process.env.JWT_REFRESH_SECRET || env.jwtRefreshSecret || "refresh_secret";
const accessExpiry = process.env.ACCESS_TOKEN_EXPIRES_IN || env.accessExpiresIn || "15m";
const refreshExpiry = process.env.REFRESH_TOKEN_EXPIRES_IN || env.refreshExpiresIn || "7d";

export const signAccessToken = (payload) => {
  return jwt.sign(payload, accessSecret, { expiresIn: accessExpiry });
};

export const signRefreshToken = (payload) => {
  return jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiry });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, accessSecret);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, refreshSecret);
};
