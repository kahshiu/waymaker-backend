import { PoolClient } from "pg/client.ts";
import { Transaction } from "pg/mod.ts";
import { QueryObjectResult } from "pg/query/query.ts";

export interface SqlQuery<IDto, IModel> {
  (
    params: {
      dto: IDto; // for insert, update, filters
    },
    client: PoolClient | Transaction
  ): Promise<QueryObjectResult<IModel>>;
}
