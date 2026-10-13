import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware.js";

export const studentOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  if (req.user.role !== "student") {
    res.status(403).json({
      message: "Student access required",
    });
    return;
  }

  next();
};
