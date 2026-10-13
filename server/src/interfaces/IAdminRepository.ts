import { IAdmin } from "../models/Admin.js";

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
}
