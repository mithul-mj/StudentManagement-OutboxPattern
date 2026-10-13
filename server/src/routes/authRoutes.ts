import { Router } from "express";

import { StudentRepository } from "../repositories/StudentRepository.js";
import { AuthService } from "../services/AuthService.js";
import { AuthController } from "../controller/AuthController.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../utils/validation.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { studentOnly } from "../middleware/studentOnly.js";
import { OutboxRepository } from "../repositories/OutboxRepository.js";
import { MongoTransactionManager } from "../config/MongoTransactionManager.js";

const router = Router();

const outboxRepository = new OutboxRepository();
const studentRepository = new StudentRepository();
const transactionManager = new MongoTransactionManager();

const authService = new AuthService(
  studentRepository,
  transactionManager,
  outboxRepository,
);
const authController = new AuthController(authService);

router.post("/register", validate(registerSchema), (req, res) =>
  authController.register(req, res),
);

router.post("/login", validate(loginSchema), (req, res) =>
  authController.login(req, res),
);

router.get("/me", authMiddleware, studentOnly, (req, res) =>
  authController.getProfile(req, res),
);

export default router;
