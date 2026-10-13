import { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const student = await this.authService.register(req.body);

      res.status(201).json({
        message: "Student registered successfully",
        student,
      });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Registration failed",
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await this.authService.login(email, password);

      res.status(200).json({
        message: "Login successful",
        ...result,
      });
    } catch (error) {
      res.status(401).json({
        message: error instanceof Error ? error.message : "Login failed",
      });
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          message: "Authentication required",
        });
        return;
      }

      const student = await this.authService.getProfile(userId);

      res.status(200).json({
        message: "Profile retrieved successfully",
        student,
      });
    } catch (error) {
      res.status(404).json({
        message: error instanceof Error ? error.message : "Student not found",
      });
    }
  }
}
