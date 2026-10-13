import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { AdminStudentService } from "../services/AdminStudentService.js";

export class AdminStudentController {
  constructor(private adminStudentService: AdminStudentService) {}

  async getAllStudents(req: AuthRequest, res: Response): Promise<void> {
    console.log("1. Controller reached");

    try {
      const students = await this.adminStudentService.getAllStudents();

      console.log("2. Students received:", students.length);

      res.status(200).json({
        message: "Students retrieved successfully",
        students,
      });
    } catch (error) {
      console.error("Controller error:", error);

      res.status(500).json({
        message: "Failed to retrieve students",
      });
    }
  }

  async getStudentById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const student = await this.adminStudentService.getStudentById(
        id as string,
      );

      res.status(200).json({
        message: "Student retrieved successfully",
        student,
      });
    } catch (error) {
      res.status(404).json({
        message: error instanceof Error ? error.message : "Student not found",
      });
    }
  }

  async updateStudent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const student = await this.adminStudentService.updateStudent(
        id as string,
        req.body,
      );

      res.status(200).json({
        message: "Student updated successfully",
        student,
      });
    } catch (error) {
      res.status(404).json({
        message:
          error instanceof Error ? error.message : "Failed to update student",
      });
    }
  }

  async deleteStudent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const student = await this.adminStudentService.deleteStudent(
        id as string,
      );

      res.status(200).json({
        message: "Student deleted successfully",
        student,
      });
    } catch (error) {
      res.status(404).json({
        message:
          error instanceof Error ? error.message : "Failed to delete student",
      });
    }
  }
}
