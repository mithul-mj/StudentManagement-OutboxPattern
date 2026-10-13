import { Request, Response } from "express";
import { AdminAuthService } from "../services/AdminAuthService.js";

export class AdminController {
  constructor(private adminAuthService: AdminAuthService) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await this.adminAuthService.login(email, password);

      res.status(200).json({
        message: "Admin login successful",
        ...result,
      });
    } catch (error) {
      res.status(401).json({
        message: error instanceof Error ? error.message : "Admin login failed",
      });
    }
  }
}
