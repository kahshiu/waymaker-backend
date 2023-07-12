import { Context, Next } from "oak/mod.ts";
import { Pool } from "pg/pool.ts";
import {
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DBNAME,
} from "#util/env.ts";
import { isNil } from "#util/misc.ts";
import { apiBad, apiInternalError, customBody } from "#util/HTTP.ts";
import { consoleInfo } from "../util/Console.ts";

const dbParams = {
  hostname: DB_HOST,
  port: DB_PORT,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DBNAME,
};
const dbPoolSize = 20;
const isLazyConnCreation = true;
const pgPool = new Pool(dbParams, dbPoolSize, isLazyConnCreation);

export const withPool = async (context: Context, next: Next) => {
  const isTested = await pgPool.initialized();
  if (!isTested) {
    try {
      const client = await pgPool.connect();
      client.release();
      consoleInfo(
        "DB INIT: ",
        `{ success: "connection secured and released" }`
      );
    } catch (error) {
      consoleInfo("DB INIT: ", error);
      apiInternalError(context, { body: customBody({}, "ERROR") });
      return;
    }
  }
  context.state.pgPool = pgPool;
  await next();
};
