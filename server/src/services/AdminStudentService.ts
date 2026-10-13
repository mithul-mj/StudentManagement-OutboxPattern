import { IOutboxRepository } from "../interfaces/IOutboxRepository.js";
import { IStudentRepository } from "../interfaces/IStudentRepository.js";
import { ITransactionManager } from "../interfaces/ITransactionManager.js";
import { IStudent } from "../models/Student.js";

type UpdateStudentData = Partial<
  Pick<IStudent, "fullName" | "email" | "phone">
>;

export class AdminStudentService {
  constructor(
    private studentRepository: IStudentRepository,
    private transactionManager: ITransactionManager,
    private outboxRepository: IOutboxRepository,
  ) {}

  async getAllStudents() {
    console.log("3. Service reached");

    const students = await this.studentRepository.findAll();

    console.log("4. Repository returned:", students.length);

    return students.map((student) => ({
      id: student._id.toString(),
      fullName: student.fullName,
      email: student.email,
      phone: student.phone,
    }));
  }
  async getStudentById(id: string) {
    const student = await this.studentRepository.findById(id);

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
  async updateStudent(id: string, data: Partial<IStudent>) {
    return await this.transactionManager.run(async (context) => {
      const student = await this.studentRepository.update(id, data, context);

      if (!student) {
        throw new Error("Student not found");
      }

      await this.outboxRepository.create(
        {
          eventType: "StudentUpdated",

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

  async deleteStudent(id: string): Promise<void> {
    await this.transactionManager.run(async (context) => {
      const student = await this.studentRepository.findById(id);

      if (!student) {
        throw new Error("Student not found");
      }

      await this.studentRepository.delete(id, context);

      await this.outboxRepository.create(
        {
          eventType: "StudentDeleted",
          aggregateId: student._id.toString(),
          payload: {
            fullName: student.fullName,
            email: student.email,
            phone: student.phone,
          },
        },
        context,
      );
    });
  }
}
