import { ITransactionContext } from "./ITransactionContext.js";
import { IStudent } from "../models/Student.js";

export interface IStudentRepository {
  create(
    data: Partial<IStudent>,
    context?: ITransactionContext,
  ): Promise<IStudent>;

  findByEmail(email: string): Promise<IStudent | null>;

  findById(id: string): Promise<IStudent | null>;

  findAll(): Promise<IStudent[]>;

  update(
    id: string,
    data: Partial<IStudent>,
    context?: ITransactionContext,
  ): Promise<IStudent | null>;

  delete(id: string, context?: ITransactionContext): Promise<IStudent | null>;
}
