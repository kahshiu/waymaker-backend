import { PoolClient } from "pg/client.ts";
import { Transaction } from "pg/mod.ts";
import { QueryObjectResult } from "pg/query/query.ts";

export interface SqlQuery<IModel> {
  (
    client: PoolClient | Transaction,
    params: {
      model: IModel; // for insert, update, filters
    }
  ): Promise<QueryObjectResult<IModel>>;
}
