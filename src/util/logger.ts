import { Context } from "oak/context.ts";
import { Next } from "oak/middleware.ts";
import { PoolClient, Transaction } from "pg/mod.ts";
import { QueryArguments } from "pg/query/query.ts";
import { consoleDebug, consoleInfo, consoleSql } from "#util/Console.ts";
import { ConsoleTags } from "./globalEnums.ts";

export const logRequest = async (context: Context, next: Next) => {
  const { ip, method, url } = context.request;
  const dt = new Date();
  const title = "LOGGER: ";
  const message = `{ timestamp: ${dt.toISOString()}, requester: ${ip}, url: HTTP_${method}@"${url}" }`;
  consoleInfo(title, message);
  await next();
};

// NOTE: logger that wraps around pool-client
export const logSql = async <TResult>(
  client: PoolClient | Transaction,
  label: string,
  query: string,
  queryArgs?: QueryArguments
) => {
  const result = await client.queryObject<TResult>(query, queryArgs);
  consoleSql(label, result);
  return result;
};

// NOTE: logger that wraps around
export const logRequestDetails = async (context: Context, next: Next) => {
  const isHTTPS = context.request.secure;
  const headers = context.request.headers;

  consoleDebug(
    "middleware, request log: ",
    {
      isHTTPS,
      headers,
    },
    [ConsoleTags.MIDDLEWARE]
  );
  await next();
};
