import { ClientSession } from "mongoose";
import { Student, IStudent } from "../models/Student.js";
import { IStudentRepository } from "../interfaces/IStudentRepository.js";
import { ITransactionContext } from "../interfaces/ITransactionContext.js";

export class StudentRepository implements IStudentRepository {
  async create(
    data: Partial<IStudent>,
    context?: ITransactionContext,
  ): Promise<IStudent> {
    const student = new Student(data);

    await student.save({
      session: context?.session as ClientSession | undefined,
    });

    return student;
  }

  async findByEmail(email: string): Promise<IStudent | null> {
    return await Student.findOne({ email }).select("+password");
  }

  async findById(id: string): Promise<IStudent | null> {
    return await Student.findById(id);
  }

  async findAll(): Promise<IStudent[]> {
    return await Student.find();
  }

  async update(
    id: string,
    data: Partial<IStudent>,
    context?: ITransactionContext,
  ): Promise<IStudent | null> {
    return await Student.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      session: context?.session as ClientSession | undefined,
    });
  }

  async delete(
    id: string,
    context?: ITransactionContext,
  ): Promise<IStudent | null> {
    return await Student.findByIdAndDelete(id, {
      session: context?.session as ClientSession | undefined,
    });
  }
}
