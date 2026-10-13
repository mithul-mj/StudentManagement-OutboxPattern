import bycypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IStudentRepository } from "../interfaces/IStudentRepository.js";
import { IStudent } from "../models/Student.js";
import { hashPassword } from "../utils/password.js";
import { comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import { ITransactionManager } from "../interfaces/ITransactionManager.js";
import { IOutboxRepository } from "../interfaces/IOutboxRepository.js";

type RegisterStudentDTO = Pick<
  IStudent,
  "fullName" | "email" | "password" | "phone"
>;
type PublicStudent = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
};

export class AuthService {
  constructor(
    private studentRepository: IStudentRepository,
    private transactionManager: ITransactionManager,
    private outboxRepository: IOutboxRepository,
  ) {}

  async register(data: RegisterStudentDTO): Promise<PublicStudent> {
    const existingStudent = await this.studentRepository.findByEmail(
      data.email,
    );

    if (existingStudent) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await hashPassword(data.password);

    return await this.transactionManager.run(async (context) => {
      const student = await this.studentRepository.create(
        {
          fullName: data.fullName,
          email: data.email,
          password: hashedPassword,
          phone: data.phone,
        },
        context,
      );

      await this.outboxRepository.create(
        {
          eventType: "StudentCreated",
          aggregateId: student._id.toString(),
          payload: {
            fullName: student.fullName,
            email: student.email,
            phone: student.phone,
          },
        },
        context,
      );

      return {
        id: student._id.toString(),
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
      };
    });
  }

  async login(email: string, password: string) {
    const student = await this.studentRepository.findByEmail(email);

    if (!student) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(password, student.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken(student._id.toString(), "student");
    return {
      token,
      student: {
        id: student._id.toString(),
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
      },
    };
  }

  async getProfile(userId: string) {
    const student = await this.studentRepository.findById(userId);

    if (!student) {
      throw new Error("Student not found");
    }

    return {
      id: student._id.toString(),
      fullName: student.fullName,
      email: student.email,
      phone: student.phone,
    };
  }
}
