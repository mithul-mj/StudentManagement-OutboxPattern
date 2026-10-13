import { Admin, IAdmin } from "../models/Admin.js";
import { IAdminRepository } from "../interfaces/IAdminRepository.js";

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<IAdmin | null> {
    return await Admin.findOne({ email: email }).select("+password");
  }
}
