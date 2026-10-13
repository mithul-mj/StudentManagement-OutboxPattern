import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: "admin" | "student";
  };
}
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  console.log("Auth middleware reached");
  const authHeader = req.headers.authorization;

  if (!authHeader && !authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Authentication token required",
    });
    return;
  }
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    !("userId" in decoded) ||
    !("role" in decoded)
  ) {
    res.status(401).json({
      message: "Invalid token",
    });
    return;
  }
  const role = decoded.role;
  if (role !== "student" && role !== "admin") {
    res.status(401).json({
      message: "invalid user role",
    });
    return;
  }
  req.user = {
    userId: String(decoded.userId),
    role,
  };
  next();
};
