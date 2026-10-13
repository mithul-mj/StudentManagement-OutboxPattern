import { Outbox } from "../models/Outbox.js";
import { syncQueue } from "./syncQueue.js";

export const publishOutboxEvents = async (): Promise<void> => {
  const events = await Outbox.find({
    processed: false,
  }).sort({ createdAt: 1 });

  for (const event of events) {
    await syncQueue.add(
      event.eventType,
      {
        outboxId: event._id.toString(),
        eventType: event.eventType,
        aggregateId: event.aggregateId,
        payload: event.payload,
      },
      {
        jobId: event._id.toString(),
      },
    );
  }
};
