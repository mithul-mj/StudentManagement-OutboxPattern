import { Admin } from "../models/Admin.js";
import { hashPassword } from "../utils/password.js";

export const initializeAdmin = async (): Promise<void> => {
  const adminEmail = "admin@example.com";
  const adminPassword = "Admin@123";

  const existingAdmin = await Admin.findOne({
    email: adminEmail,
  });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await hashPassword(adminPassword);

  await Admin.create({
    email: adminEmail,
    password: hashedPassword,
  });

  console.log("Default admin created");
};
