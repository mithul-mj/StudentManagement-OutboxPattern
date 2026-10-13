import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateToken = (
  userId: string,
  role: "admin" | "student",
): string => {
  return jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: "1d" });
};
