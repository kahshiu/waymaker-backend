import { PoolClient, Transaction } from "pg/mod.ts";
import { QueryArguments } from "pg/query/query.ts";
import { LogSqlStatement } from "../../middleware/logger/LogHelpers.ts";

// NOTE: logger that wraps around pool-client
export const query = async <TResult>(
  client: PoolClient | Transaction,
  label: string,
  query: string,
  queryArgs?: QueryArguments
) => {
  const result = await client.queryObject<TResult>(query, queryArgs);
  LogSqlStatement(label, result);
  return result;
};
