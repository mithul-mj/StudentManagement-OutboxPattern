import { ITransactionContext } from "./ITransactionContext.js";

export interface IOutboxRepository {
  create(
    data: {
      eventType: "StudentCreated" | "StudentUpdated" | "StudentDeleted";
      aggregateId: string;
      payload: Record<string, unknown>;
    },
    context: ITransactionContext,
  ): Promise<void>;
}
