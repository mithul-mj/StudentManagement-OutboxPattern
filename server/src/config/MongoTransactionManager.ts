import mongoose from "mongoose";
import { ITransactionManager } from "../interfaces/ITransactionManager.js";
import { ITransactionContext } from "../interfaces/ITransactionContext.js";

export class MongoTransactionManager implements ITransactionManager {
  async run<T>(
    callback: (context: ITransactionContext) => Promise<T>,
  ): Promise<T> {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const result = await callback({
        session,
      });

      await session.commitTransaction();

      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
