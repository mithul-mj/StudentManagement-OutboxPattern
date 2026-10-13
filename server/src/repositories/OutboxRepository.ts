import { ClientSession } from "mongoose";
import { Outbox, IOutbox } from "../models/Outbox.js";
import { IOutboxRepository } from "../interfaces/IOutboxRepository.js";
import { ITransactionContext } from "../interfaces/ITransactionContext.js";

export class OutboxRepository implements IOutboxRepository {
  async create(
    data: {
      eventType: "StudentCreated" | "StudentUpdated" | "StudentDeleted";
      aggregateId: string;
      payload: Record<string, unknown>;
    },
    context: ITransactionContext,
  ): Promise<void> {
    const event = new Outbox({
      ...data,
      processed: false,
    });

    await event.save({
      session: context.session as ClientSession,
    });
  }
}
