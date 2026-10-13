import { prisma } from "../config/prisma.js";
import { ISqlStudentRepository } from "../interfaces/ISqlStudentRepository.js";

export class SqlStudentRepository implements ISqlStudentRepository {
  async createOrUpdate(data: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  }): Promise<void> {
    await prisma.student.upsert({
      where: {
        id: data.id,
      },

      create: data,

      update: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
      },
    });
  }

  async update(
    id: string,
    data: {
      fullName?: string;
      email?: string;
      phone?: string;
    },
  ): Promise<void> {
    await prisma.student.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.student.deleteMany({
      where: {
        id,
      },
    });
  }
}
