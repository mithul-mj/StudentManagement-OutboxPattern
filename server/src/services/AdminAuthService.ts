import { IAdminRepository } from "../interfaces/IAdminRepository.js";
import { comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";

type PublicAdmin = {
  id: string;
  email: string;
};

export class AdminAuthService {
  constructor(private adminRepository: IAdminRepository) {}

  async login(email: string, password: string) {
    const admin = await this.adminRepository.findByEmail(email);

    if (!admin) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(password, admin.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken(admin._id.toString(), "admin");

    const publicAdmin: PublicAdmin = {
      id: admin._id.toString(),
      email: admin.email,
    };

    return {
      token,
      admin: publicAdmin,
    };
  }
}
