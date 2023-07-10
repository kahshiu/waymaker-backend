import { Pool } from "https://deno.land/x/postgres@v0.17.0/pool.ts";
import {
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DBNAME,
} from "./env.ts";

const dbParams = {
  hostname: DB_HOST,
  port: DB_PORT,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DBNAME,
};
const poolSize = 20;
const isConnCreationLazy = true;

let globalPool: Pool;

// NOTE: singleton Pool of connections
export const pgPool = () => {
  if (globalPool) return globalPool;

  try {
    globalPool = new Pool(dbParams, poolSize, isConnCreationLazy);
  } catch (error) {
    console.log("error in connecting db", error);
  }
};
