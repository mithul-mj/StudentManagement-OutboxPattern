import { Router } from "express";

import { AdminRepository } from "../repositories/AdminRepository.js";
import { AdminAuthService } from "../services/AdminAuthService.js";
import { AdminController } from "../controller/AdminController.js";
import { validate } from "../middleware/validate.js";
import { adminLoginSchema } from "../utils/validation.js";

import { StudentRepository } from "../repositories/StudentRepository.js";
import { AdminStudentService } from "../services/AdminStudentService.js";
import { AdminStudentController } from "../controller/AdminStudentController.js";

import { updateStudentSchema } from "../utils/validation.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminOnly.js";

import { OutboxRepository } from "../repositories/OutboxRepository.js";
import { MongoTransactionManager } from "../config/MongoTransactionManager.js";
const router = Router();

const adminRepository = new AdminRepository();

const adminAuthService = new AdminAuthService(adminRepository);

const adminController = new AdminController(adminAuthService);

const studentRepository = new StudentRepository();

const transactionManager = new MongoTransactionManager();

const outboxRepository = new OutboxRepository();

const adminStudentService = new AdminStudentService(
  studentRepository,
  transactionManager,
  outboxRepository,
);
const adminStudentController = new AdminStudentController(adminStudentService);

router.post("/login", validate(adminLoginSchema), (req, res) =>
  adminController.login(req, res),
);

router.get("/students", authMiddleware, adminOnly, (req, res) =>
  adminStudentController.getAllStudents(req, res),
);

router.get("/students/:id", authMiddleware, adminOnly, (req, res) =>
  adminStudentController.getStudentById(req, res),
);

router.patch(
  "/students/:id",
  authMiddleware,
  adminOnly,
  validate(updateStudentSchema),
  (req, res) => adminStudentController.updateStudent(req, res),
);

router.delete("/students/:id", authMiddleware, adminOnly, (req, res) =>
  adminStudentController.deleteStudent(req, res),
);

export default router;
