import { Worker } from "bullmq";
import { Redis } from "ioredis";

import { Outbox } from "../models/Outbox.js";
import { SqlStudentRepository } from "../repositories/SqlStudentRepository.js";

const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

const sqlStudentRepository = new SqlStudentRepository();

export const startSyncWorker = (): Worker => {
  const worker = new Worker(
    "mongo-to-sql-sync",

    async (job) => {
      const { outboxId, eventType, aggregateId, payload } = job.data;

      console.log(`Processing ${eventType}`);

      if (eventType === "StudentCreated") {
        await sqlStudentRepository.createOrUpdate({
          id: aggregateId,
          fullName: payload.fullName as string,
          email: payload.email as string,
          phone: payload.phone as string,
        });
      }

      if (eventType === "StudentUpdated") {
        await sqlStudentRepository.update(aggregateId, {
          fullName: payload.fullName as string,
          email: payload.email as string,
          phone: payload.phone as string,
        });
      }

      if (eventType === "StudentDeleted") {
        await sqlStudentRepository.delete(aggregateId);
      }

      await Outbox.findByIdAndUpdate(outboxId, {
        processed: true,
      });

      console.log(`Successfully synchronized ${eventType}`);
    },

    {
      connection,
    },
  );

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on("failed", (job, error) => {
    console.error(`Job ${job?.id} failed:`, error);
  });

  console.log("Sync worker started");

  return worker;
};
