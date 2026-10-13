import mongoose, { Document, Schema } from "mongoose";

export type OutboxEventType =
  "StudentCreated" | "StudentUpdated" | "StudentDeleted";

export interface IOutbox extends Document {
  eventType: OutboxEventType;
  aggregateId: string;
  payload: Record<string, unknown>;
  processed: boolean;
  createdAt: Date;
}

const outboxSchema = new Schema<IOutbox>(
  {
    eventType: {
      type: String,
      enum: ["StudentCreated", "StudentUpdated", "StudentDeleted"],
      required: true,
    },

    aggregateId: {
      type: String,
      required: true,
    },

    payload: {
      type: Schema.Types.Mixed,
      required: true,
    },

    processed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Outbox = mongoose.model<IOutbox>("Outbox", outboxSchema);
