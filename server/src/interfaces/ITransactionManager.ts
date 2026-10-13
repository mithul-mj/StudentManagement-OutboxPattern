import { ITransactionContext } from "./ITransactionContext.js";

export interface ITransactionManager {
  run<T>(callback: (context: ITransactionContext) => Promise<T>): Promise<T>;
}
