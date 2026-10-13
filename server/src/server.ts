import express from "express";
import { connectDB } from "./config/database.js";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { initializeAdmin } from "./seed/adminSeed.js";
import { startSync } from "./sync/startSync.js";

import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    await initializeAdmin();

    startSync();

    app.listen(env.PORT, () => {
      console.log("running");
    });
  } catch (error) {
    console.error("failed");
  }
};
startServer();
