import { publishOutboxEvents } from "./outboxPublisher.js";
import { startSyncWorker } from "./syncWorker.js";

export const startSync = (): void => {
  startSyncWorker();

  setInterval(async () => {
    try {
      await publishOutboxEvents();
    } catch (error) {
      console.error("Outbox publisher error:", error);
    }
  }, 5000);

  console.log("MongoDB → PostgreSQL sync started");
};
